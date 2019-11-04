var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server)

var port = process.env.PORT || 3000

server.listen(port,  () => console.log(`listening on port ${ port }`))

var connections = []

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
        socket.emit('message',
        { 'user': 'Serveur', 'message': 'Bienvenue ' + socket.username + ' sur Rosalina. Il y a actuellement ' + connections.length + ' personne(s) connectée(s).'})
        connections.push(socket.username)
    })
    socket.on('disconnect', () => {
        console.log('user left : ' + socket.username)
        socket.broadcast.emit('message',
        { 'user': 'Serveur', 'message': socket.username + ' a quitté le chat !'})
        connections[socket.username] = null
    })
})