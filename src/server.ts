import { config } from 'dotenv'
import express from 'express'
import socketIO from 'socket.io'
import http from 'http'
import cors from 'cors'
import { MongoConnection } from './connection'
import { Message } from './models/Message'

config()

MongoConnection.connect()

const app = express()

app.use(cors())

const server = http.createServer(app)

console.log(process.env.CORS_ACCESS)
const corsAccess = process.env.CORS_ACCESS?.split(',')
console.log(corsAccess)

const io = new socketIO.Server(server, {
  cors: {
    origin: corsAccess,
    methods: '*'
  }
})

const ROOM_NAME = 'tuttochat_room'

io.on('connection', async (socket) => {
  socket.join(ROOM_NAME)
  console.log(`Socket connected ${socket.id} and joined to the room`)

  socket.on('send_message', async (data: { message: string, ISODate: string, userId: string, id: string }) => {
    const message = new Message({ message: data.message, ISODate: data.ISODate, userId: data.userId })
    await message.save()
    socket.to(ROOM_NAME).emit('receive_message', data)
  })

  socket.on('typing_message', (data: { typing: boolean }) => {
    socket.to(ROOM_NAME).emit('typing_message', data)
  })

  socket.on('get_messages', async (callback) => {
    const messages = await Message.find({})

    callback(messages)
  })

  socket.on('disconnect', () => {
    console.log(`Socket disconnected ${socket.id}`)
  })
})

const port = process.env.PORT ?? 9876

server.listen(port, function () {
  console.log(`Listening on port ${port}`)
})
