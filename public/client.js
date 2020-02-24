const socket = io("http://localhost:8080")
const chatName = document.getElementById("chat-name")
const setName = document.getElementById("set-name")
const chatMessage = document.getElementById("chat-message")
const sendMessage = document.getElementById("send-message")

setName.addEventListener("click", e => {
    socket.emit("set-name", chatName.value)
})
sendMessage.addEventListener("click", e => {
    socket.emit("send-message", chatMessage.value)
    chatMessage.value = ""
    chatMessage.focus()
})
socket.on("chat-message", data => {
  appendMessage(`${data.name}: ${data.message}`)
})

socket.on("user-connected", name => {
  appendMessage(`${name} connected`)
})

socket.on("user-disconnected", name => {
  appendMessage(`${name} disconnected`)
})
