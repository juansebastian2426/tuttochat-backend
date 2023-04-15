import mongoose from 'mongoose'

const schema = new mongoose.Schema({ message: 'string', ISODate: 'string', userId: 'string' }, {
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v

      return ret
    }
  },
  toObject: {
    transform: function (doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.__v

      return ret
    }
  }
})

export const Message = mongoose.model('Message', schema)
