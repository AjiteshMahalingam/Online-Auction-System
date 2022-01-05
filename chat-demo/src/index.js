const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;
const dirpath = path.join(__dirname, '../public');

app.use(express.static(dirpath));
app.get('/test', (req, res) => {
    res.send("<p>Hello<p>");
});
io.on('connection', (socket) => {
    console.log('New connection established');

    socket.on('join', ({username, room}, callback) => {
        const {error, user} = addUser({ id : socket.id, username, room});

        if(error) { 
            return callback(error);
        }
        socket.join(user.room);

        socket.emit('message', generateMessage('Admin', 'Welcome!'));
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin' ,`${user.username} has joined`));
        io.to(user.room).emit('roomData', {
            room : user.room,
            users : getUsersInRoom(user.room)
        });
        callback();
    });
    
    socket.on('sendMessage', (inpMsg, callback) => {
        const user = getUser(socket.id);
        const filter = new Filter();
        if(filter.isProfane(inpMsg))
            return callback('Profanity is not allowed');
        io.to(user.room).emit('message', generateMessage(user.username, inpMsg));
        callback();
    });
    
    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${location.latitude},${location.longitude}`));
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if(user) {
            io.to(user.room).emit('message', generateMessage('Admin' ,`${user.username} left`));
            io.to(user.room).emit('roomData', {
                room : user.room,
                users : getUsersInRoom(user.room)
            });
        }
    })
})

server.listen(PORT, () => {
    console.log('Server is up at port : ' + PORT);
});