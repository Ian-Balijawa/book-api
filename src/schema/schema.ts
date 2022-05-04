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
//   { name: 'Name of the wild', genre: 'Fantasy', id: '1', authorId: '1' },
//   { name: 'The Final Empire', genre: 'Sci-Fi', id: '2', authorId: '2' },
//   {
//     name: "Don't mess with the Zohan",
//     genre: 'Comedy',
//     id: '3',
//     authorId: '3'
//   },
//   { name: 'The Long Earth', genre: 'Sci-Fi', id: '4', authorId: '1' },
//   { name: 'Hero of Ages', genre: 'Family', id: '4', authorId: '2' },
//   { name: 'The Light Fantanstic', genre: 'Sci-Fi', id: '4', authorId: '3' }
// ]

// var authors = [
//   { name: 'Ian Balijawa', age: 23, id: '1' },
//   { name: 'Patrick Sandersen', age: 33, id: '2' },
//   { name: 'Harry Maguire', age: 27, id: '3' }
// ]

interface Args {
  id: typeof GraphQLID
}

interface Author {
  name: string
  id: string
  age: number
}
interface Book {
  name: string
  authorId: string
  genre: string
  id: string
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
      resolve: (parent: Book, args: Args) => {
        return Author.findById(parent.authorId)
      }
    }
  })
})

//@ts-ignore
const AuthorType = new GraphQLObjectType<Author, Book>({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve: (parent: Author, args: Args) => {
        return Book.find({ authorId: parent.id })
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: {
        id: { type: GraphQLID }
      },
      resolve: (parent, args: Args) => {
        return Book.findById(args.id)
      }
    },
    author: {
      type: AuthorType,
      args: {
        id: { type: GraphQLID }
      },
      resolve: (parent, args: Args) => {
        return Author.findById(args.id)
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve: (parent: Book, args: Args) => {
        return Book.find({})
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve: (parent, args: Args) => {
        return Author.find({})
      }
    }
  }
})

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
      resolve: (parent, args: Author) => {
        let author = Author.build({ name: args.name, age: args.age })
        return author.save()
      }
    },
    addBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: {
          type: new GraphQLNonNull(GraphQLString)
        },
        authorId: { type: GraphQLID }
      },

      resolve: (parent, args: Book) => {
        const { name, genre, authorId } = args

        let book = Book.build({
          name,
          genre,
          authorId
        })
        return book.save()
      }
    }
  }
})

const schema = new GraphQLSchema({ query: RootQuery, mutation: Mutation })
export { schema }
