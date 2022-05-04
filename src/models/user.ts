import mongoose from 'mongoose'

interface UserAttrs {
  name: string
  email: string
  password: string
}

interface UserDoc extends mongoose.Document {
  password: string
  name: string
  email: string
}

interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform(doc: any, ret: any) {
        ret.id = ret._id
        delete ret._id
        delete ret.password
        delete ret.__v
      }
    }
  }
)

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}

// userSchema.statics.generateAuthtoken = () => {}

userSchema.pre('save', function (done) {
  if (this.isModified('password')) {
    //re-hash the password
  }
  done()
})
