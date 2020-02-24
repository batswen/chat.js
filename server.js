const express = require("express")
const app = express()
const server = app.listen(8080)
app.use(express.static("public"), listen)
const io = require("socket.io")(server)

const users = {}

function listen() {
    const host = server.address().address
    const port = server.address().port
}

io.on("connection", socket => {
    console.log("New connection")
    socket.on("set-name", name => {
        console.log("Name:", name)
        users[socket.id] = name
        io.sockets.emit("user-connected", name)
    })
    socket.on("send-message", msg => {
        console.log("Msg:",msg.message)
        if (users[socket.id] !== undefined) {
            io.sockets.emit("chat-message", { message: msg.message, timestamp: msg.timestamp, name: users[socket.id] })
        }
    })
    socket.on("disconnect", () => {
        io.sockets.emit("user-disconnected", users[socket.id])
        delete users[socket.id]
    })
})

/*
// Send it to all other clients
socket.broadcast.emit('mouse', data);

// This is a way to send to everyone including sender
io.sockets.emit('message', "this goes to everyone");
*/