import mongoose from 'mongoose'

interface AuthorAttrs {
  name: string
  age: number
}

export interface AuthorDoc extends mongoose.Document {
  name: string
  age: string
}

interface AuthorModel extends mongoose.Model<AuthorDoc> {
  build(attrs: AuthorAttrs): AuthorDoc
}

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc: any, ret: any) {
        ret.id = ret.__id
        delete ret._id
        delete ret.__v
      }
    }
  }
)

authorSchema.statics.build = (attrs: AuthorAttrs) => {
  return new Author(attrs)
}

const Author = mongoose.model<AuthorDoc, AuthorModel>('Author', authorSchema)

export { Author }
