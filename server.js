const express = require("express")
const app = express()
const server = app.listen(8080)
app.use(express.static("public"), listen)
const io = require("socket.io")(server)

const users = {}

function listen() {
    const host = server.address().address
    const port = server.address().port
    console.log('Example app listening at http://' + host + ':' + port)
}

io.on("connection", socket => {
    socket.on("set-name", name => {
        console.log("Name:", name)
        users[socket.id] = name
        socket.broadcast.emit("user-connected", name)
    })
    socket.on("send-message", message => {
        console.log("Msg:",message)
        if (users[socket.id] !== undefined) {
            socket.broadcast.emit("chat-message", { message: message, name: users[socket.id] })
        }
    })
    socket.on("disconnect", () => {
        socket.broadcast.emit("user-disconnected", users[socket.id])
        delete users[socket.id]
    })
})

/*
// Send it to all other clients
socket.broadcast.emit('mouse', data);

// This is a way to send to everyone including sender
io.sockets.emit('message', "this goes to everyone");
*/
