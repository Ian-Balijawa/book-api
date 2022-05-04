import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} from 'graphql'

import { Author } from '../models/Author'
import { Book } from '../models/Book'

// dummy data
// var books = [
//   { name: 'Name of the wild', genre: 'Fantasy', id: '1', author: '1' },
//   { name: 'The Final Empire', genre: 'Sci-Fi', id: '2', author: '2' },
//   {
//     name: "Don't mess with the Zohan",
//     genre: 'Comedy',
//     id: '3',
//     author: '3'
//   },
//   { name: 'The Long Earth', genre: 'Sci-Fi', id: '4', author: '1' },
//   { name: 'Hero of Ages', genre: 'Family', id: '4', author: '2' },
//   { name: 'The Light Fantanstic', genre: 'Sci-Fi', id: '4', author: '3' }
// ]

// var authors = [
//   { name: 'Ian Balijawa', age: 23, id: '1' },
//   { name: 'Patrick Sandersen', age: 33, id: '2' },
//   { name: 'Harry Maguire', age: 27, id: '3' }
// ]

interface Args {
  id: typeof GraphQLID
}

interface AuthorArgs {
	name: string;
	id: string;
	age: number;
}
interface BookArgs {
	name: string;
	authorId?: string;
	author: {
		id: string;
		name: string;
		age: number;
	};
	genre: string;
	id: string;
}
//@ts-ignore
const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		genre: { type: GraphQLString },
		author: {
			type: AuthorType,
			resolve: async (parent: BookArgs, args: Args) => {
				console.log('running author query in book');
				console.log(parent.author.id);
				const author = await Author.findById(parent.author.id);
				console.log(author!.id.toString());
				return author;
			}
		}
	})
});

//@ts-ignore
const AuthorType = new GraphQLObjectType<Author, Book>({
	name: 'Author',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		books: {
			type: new GraphQLList(BookType),
			resolve: (parent: AuthorArgs, args: Args) => {
				return Book.find({ author: parent.id });
			}
		}
	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		book: {
			type: BookType,
			args: {
				id: { type: GraphQLID }
			},
			resolve: (parent, args: Args) => {
				return Book.findById(args.id);
			}
		},
		author: {
			type: AuthorType,
			args: {
				id: { type: GraphQLID }
			},
			resolve: (parent, args: Args) => {
				return Author.findById(args.id);
			}
		},
		books: {
			type: new GraphQLList(BookType),
			resolve: (parent: BookArgs, args: Args) => {
				return Book.find({});
			}
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve: (parent, args: Args) => {
				return Author.find({});
			}
		}
	}
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addAuthor: {
			type: AuthorType,
			args: {
				name: {
					type: new GraphQLNonNull(GraphQLString)
				},
				age: {
					type: new GraphQLNonNull(GraphQLInt)
				}
			},
			resolve: async (parent, args: AuthorArgs) => {
				let author = await Author.findOne({ name: args.name });
				if (author) {
					console.log(author);
					console.log(`Author ${args.name} already exists`);
					return;
				}

				author = Author.build({ name: args.name, age: args.age });
				return author.save();
			}
		},
		addBook: {
			type: BookType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				genre: {
					type: new GraphQLNonNull(GraphQLString)
				},
				authorId: { type: new GraphQLNonNull(GraphQLID) }
			},

			resolve: async (parent, args: BookArgs) => {
				const { name, genre, authorId } = args;

				const author = await Author.findById(authorId);

				if (!author) {
					console.error(
						'No such Author. You must provid a valid authorId'
					);
					return;
				}

				let book = await Book.findOne({ name, genre });

				if (book) {
					console.error(`Book ${name} under ${genre} already exists`);
					return;
				}

				book = Book.build({
					name,
					genre,
					author: author!
				});
				return book.save();
			}
		}
	}
});

const schema = new GraphQLSchema({ query: RootQuery, mutation: Mutation })
export { schema }
