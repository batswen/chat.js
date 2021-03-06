const ip = document.getElementById("chat-ip").value

const socket = io(ip + ":8080")
const chatName = document.getElementById("chat-name")
const setName = document.getElementById("set-name")
const chatMessage = document.getElementById("chat-message")
const sendMessage = document.getElementById("send-message")
const message = document.getElementById("message-container")
const users = document.getElementById("user-list")

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
    const time = timeToString(data)
    appendChat(`<div class="container"><img src="/img/right.png" alt="Avatar"><p>${data.message}</p><span class="time-right">${data.name} ${time}</span></div>`)
})
socket.on("chat-connect", data => {
    const time = timeToString(data)
    appendChat(`<div class="container"><img src="/img/bot.png" alt="Avatar"><p>${data.name} connected</p><span class="time-right">${time}</span></div>`)
})
socket.on("chat-disconnect", data => {
    const time = timeToString(data)
    appendChat(`<div class="container"><img src="/img/bot.png" alt="Avatar"><p>${data.name} disconnected</p><span class="time-right">${time}</span></div>`)
})
socket.on("user-list", data => {
    let html = `<ul><li class="top">Users</li>`
    for (let user of data) {
        html += `<li>${user}</li>`
    }
    html += "</ul>"
    users.innerHTML = html
})

function appendChat(msg) {
    message.innerHTML += msg
    message.scrollTop = message.scrollHeight
}
function send() {
    if (chatMessage.value !== "") {
        const time = timeToString({timestamp: new Date()})
        socket.emit("send-message", {message: chatMessage.value, timestamp: new Date()})
        appendChat(`<div class="container darker"><img src="/img/left.png" alt="Avatar" class="right"><p>${chatMessage.value}</p><span class="time-left">${time}</span></div>`)
        chatMessage.value = ""
        chatMessage.focus()
    }
}

function addZero(num) {
    return num < 10 ? "0" + num : num
}

function timeToString(data) {
    const date = new Date(data.timestamp)
    return addZero(date.getHours()) + ":" + addZero(date.getMinutes())
}

chatMessage.disabled = true
sendMessage.disabled = true
