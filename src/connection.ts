import mongoose, { type Mongoose } from 'mongoose'

export class MongoConnection {
  static async connect (): Promise<Mongoose> {
    try {
      const uri = process.env.MONGO_URI as string
      const connection = await mongoose.connect(uri)

      console.log('connection succesfully')
      return connection
    } catch (error) {
      console.error('error in connection', error)
      throw new Error('error in connection')
    }
  }
}
