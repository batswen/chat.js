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
    socket.on("set-name", name => {
        users[socket.id] = name
        io.sockets.emit("new-user-connected", name)
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
socket.emit("eventname", data)              // to this socket
socket.broadcast.emit("eventname", data)    // all other sockets
io.sockets.emit("eventname"', data)         // all sockets
*/
