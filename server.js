//Init express server and socket.io
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const uuid = require('uuid')

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.redirect('/' + uuid.v4())
})

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room })
})

//on connection
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId) //make this user join the room
        socket.to(roomId).broadcast.emit('user-connected ', userId) //broadcast to everyone else
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(3000)