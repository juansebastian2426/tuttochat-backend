"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const connection_1 = require("./connection");
const Message_1 = require("./models/Message");
(0, dotenv_1.config)();
connection_1.MongoConnection.connect();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const server = http_1.default.createServer(app);
const io = new socket_io_1.default.Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
        methods: '*'
    }
});
const ROOM_NAME = 'tuttochat_room';
io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    socket.join(ROOM_NAME);
    console.log(`Socket connected ${socket.id} and joined to the room`);
    socket.on('send_message', (data) => __awaiter(void 0, void 0, void 0, function* () {
        const message = new Message_1.Message({ message: data.message, ISODate: data.ISODate, userId: data.userId });
        yield message.save();
        socket.to(ROOM_NAME).emit('receive_message', data);
    }));
    socket.on('typing_message', (data) => {
        socket.to(ROOM_NAME).emit('typing_message', data);
    });
    socket.on('get_messages', (callback) => __awaiter(void 0, void 0, void 0, function* () {
        const messages = yield Message_1.Message.find({});
        callback(messages);
    }));
    socket.on('disconnect', () => {
        console.log(`Socket disconnected ${socket.id}`);
    });
}));
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 9876;
server.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
