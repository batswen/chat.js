const ip = document.getElementById("chat-ip").value

const socket = io(ip + ":8080")
const chatName = document.getElementById("chat-name")
const setName = document.getElementById("set-name")
const chatMessage = document.getElementById("chat-message")
const sendMessage = document.getElementById("send-message")
const message = document.getElementById("message-container")

setName.addEventListener("click", e => {
    if (chatName.value !== "") {
        socket.emit("set-name", chatName.value)
        chatName.disabled = true
        setName.disabled = true
        chatMessage.disabled = false
        sendMessage.disabled = false
    }
})
chatMessage.addEventListener("keyup", e => {
    if (e.keyCode === 13) {
        send()
    }
})
sendMessage.addEventListener("click", e => {
    send()
})
socket.on("chat-message", data => {
    const time = getTime(data)
    appendChat(`<div class="msg-info">${data.name} (${time}):</div><div class="msg-msg">${data.message}</div>`)
})

function appendChat(msg) {
    message.innerHTML += "<div class='msg'>" + msg + "</div>"
    message.scrollTop = message.scrollHeight
}
function send() {
    if (chatMessage.value !== "") {
        const time = getTime({timestamp: new Date()})
        socket.emit("send-message", {message: chatMessage.value, timestamp: new Date()})
        appendChat(`<div class="msg-info">You (${time}):</div><div class="msg-msg">${chatMessage.value}</div>`)
        chatMessage.value = ""
        chatMessage.focus()
    }
}

function addZero(num) {
    return num < 10 ? "0" + num : num
}

function getTime(data) {
    const date = new Date(data.timestamp)
    return addZero(date.getHours()) + ":" + addZero(date.getMinutes())
}

chatMessage.disabled = true
sendMessage.disabled = true
