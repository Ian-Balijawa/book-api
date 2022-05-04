import express, { Application } from 'express'
import { graphqlHTTP } from 'express-graphql'
import { schema } from './schema/schema'
import mongoose from 'mongoose'

const app: Application = express()

const mongoUri = 'mongodb://localhost:27017/books'

async function connectToDatabase() {
  await mongoose.connect(mongoUri)
  console.log('Connected to mongoDB via: ' + mongoUri)
}

app.use(
  '/api',
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV !== 'production'
  })
)

connectToDatabase()

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`))
