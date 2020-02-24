const socket = io("http://localhost:8080")
const chatName = document.getElementById("chat-name")
const setName = document.getElementById("set-name")
const chatMessage = document.getElementById("chat-message")
const sendMessage = document.getElementById("send-message")
const messageContainer = document.getElementById("message-container")

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
  appendMessage(`${data.name} (${data.timestamp}): ${data.message}`)
})

socket.on("user-connected", name => {
  appendMessage(`${name} connected`)
})

socket.on("user-disconnected", name => {
  appendMessage(`${name} disconnected`)
})

function appendMessage(msg) {
    messageContainer.innerHTML += "<p>" + msg + "</p>"
}
