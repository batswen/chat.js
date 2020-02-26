const socket = io("http://localhost:8080")
const chatName = document.getElementById("chat-name")
const setName = document.getElementById("set-name")
const chatMessage = document.getElementById("chat-message")
const sendMessage = document.getElementById("send-message")
const message = document.getElementById("message")

setName.addEventListener("click", e => {
    if (chatName.value !== "") {
        socket.emit("set-name", chatName.value)
    }
})
sendMessage.addEventListener("click", e => {
    if (chatMessage.value !== "") {
        socket.emit("send-message", {message: chatMessage.value, timestamp: new Date()})
        chatMessage.value = ""
        chatMessage.focus()
    }
})
socket.on("chat-message", data => {
    console.log("chat-message", `${data.name} (${data.timestamp}): ${data.message}`)
    appendChat(`${data.name} (${data.timestamp}): ${data.message}`)
})

socket.on("new-user-connected", name => {
    console.log(`${name} connected`)
    appendChat(`${name} connected`)
})

socket.on("user-disconnected", name => {
    console.log(`${name} disconnected`)
    appendChat(`${name} disconnected`)
})

function appendChat(msg) {
    message.innerHTML += "<p>" + msg + "</p>"
}
