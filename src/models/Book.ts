import mongoose from 'mongoose'
import { AuthorDoc } from './Author'

interface BookAttrs {
  name: string
  author: AuthorDoc
  genre: string
}

interface BookDoc extends mongoose.Document {
  name: string
  genre: string
  author: AuthorDoc
}

interface BookModel extends mongoose.Model<BookDoc> {
  build(attrs: BookAttrs): BookDoc
}

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    genre: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author'
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.__v
      }
    }
  }
)

bookSchema.statics.build = (attrs: BookAttrs) => {
  return new Book(attrs)
}

const Book = mongoose.model<BookDoc, BookModel>('Book', bookSchema)

export { Book }
