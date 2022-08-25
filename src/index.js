const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const mongoose = require("mongoose");
const router = require('./routes/index')
const app = express()
const cors = require('cors')
const { generateMessage, addMessage, getMessages } = require('./services/messages')
const { removeUser, getUserById } = require('./services/users.service')
const { getRoomByName, addUser, getUsersInRoom } = require('./services/room.service')
const server = http.createServer(app)
const io = socketio(server)
const { jwtStrategy } = require('./middlewares/passport')
const passport = require('passport')
const morgan = require('morgan')
require('dotenv').config()

const port = process.env.PORT || 3001
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

//enable cors
app.use(cors());
app.options('*', cors());

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use('/', router)
// app.use(morgan())

io.on('connect', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', async(options, callback) => {
        console.log("🚀 ~ file: index.js ~ line 43 ~ socket.on ~ options", options)
        const {user, room, userId} = await addUser(options.username, options.room)
        socket.join(room)

        socket.broadcast.to(room).emit('message', generateMessage('Admin', `${user} has joined!`))

        const listUsers = await getUsersInRoom(room);
        console.log("🚀 ~ file: index.js ~ line 49 ~ socket.on ~ listUsers", listUsers)
        io.to(room).emit('roomData', {
            room: room,
            users: listUsers,
            userId: userId
        })
        callback()
    })

    socket.on('sendMessage', async (options, callback) => {
        const { userId, message, room } = options;
        const user = await getUserById(userId);
        const getRoom = await getRoomByName(room);
        // const filter = new Filter();
        
        // if (filter.isProfane(message)) {
        //     message = '*'.repeat(message.length);
        // }
        
        console.log("🚀 ~ file: index.js ~ line 61 ~ socket.on ~ message", message);
        io.to(room).emit('message', generateMessage(user.name, message));
        await addMessage(user._id, message, getRoom._id);
        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

dbConnect()

function dbConnect() {
    mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    mongoose.connection
      .on("error", console.error.bind(console, "Connection error: "))
      .once("open", function() {
        console.log("Connect successfully!")
      });
}

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})