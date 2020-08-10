const express = require("express")
const app = express()
const server = app.listen(8080)
app.use(express.static("public"))
const io = require("socket.io")(server)

const users = {}

io.on("connection", socket => {
    socket.on("set-name", name => {
        users[socket.id] = name
        io.sockets.emit("chat-connect", { name, timestamp: new Date() })
        const usernames = []
        for (user in users) {
            usernames.push(users[user])
        }
        //console.log(usernames)
        io.sockets.emit("user-list", usernames)
    })
    socket.on("send-message", msg => {
        if (users[socket.id] !== undefined) {
            socket.broadcast.emit("chat-message", { message: msg.message, timestamp: msg.timestamp, name: users[socket.id] })
        }
    })
    socket.on("disconnect", () => {
        io.sockets.emit("chat-disconnect", { name: users[socket.id], timestamp: new Date() })
        delete users[socket.id]
    })
})

/*
socket.emit("eventname", data)              // to this socket
socket.broadcast.emit("eventname", data)    // all other sockets
io.sockets.emit("eventname"', data)         // all sockets
*/
