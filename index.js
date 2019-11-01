const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.username = 'Rosalina';
    socket.on('change username', (name) => socket.username = name)
    socket.on('message', (msg) => io.emit('message',
    { 'user': socket.username, 'message': msg }))
    socket.on('join', (username) => {
        if (username != null) {
            socket.username = username
        }
        console.log('user joined : ' + socket.username)
        socket.broadcast.emit('message',
        { 'user': 'Serveur', 'message': socket.username + ' a rejoint le chat !'})
    })
})

http.listen(3000, () => console.log('listening on port 3000'))