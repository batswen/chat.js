const ip = document.getElementById("chat-ip").value

const socket = io(ip + ":8080")
const chatName = document.getElementById("chat-name")
const setName = document.getElementById("set-name")
const chatMessage = document.getElementById("chat-message")
const sendMessage = document.getElementById("send-message")
const message = document.getElementById("message-container")

const users = []

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
    appendChat(`<div class="container"><img src="/img/right.png" alt="Avatar"><p>${data.message}</p><span class="time-right">${data.name} ${time}</span></div>`)
})
socket.on("chat-connect", data => {
    const time = getTime(data)
    appendChat(`<div class="container"><img src="/img/bot.png" alt="Avatar"><p>${data.name} connected</p><span class="time-right">${time}</span></div>`)
})
socket.on("chat-disconnect", data => {
    const time = getTime(data)
    appendChat(`<div class="container"><img src="/img/bot.png" alt="Avatar"><p>${data.name} disconnected</p><span class="time-right">${time}</span></div>`)
})

function appendChat(msg) {
    message.innerHTML += msg
    message.scrollTop = message.scrollHeight
}
function send() {
    if (chatMessage.value !== "") {
        const time = getTime({timestamp: new Date()})
        socket.emit("send-message", {message: chatMessage.value, timestamp: new Date()})
        appendChat(`<div class="container darker"><img src="/img/left.png" alt="Avatar" class="right"><p>${chatMessage.value}</p><span class="time-left">${time}</span></div>`)
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

function updateUsers() {
    const u = document.getElementById("user-list")
    u.innerHTML = ""
    console.log(users)
    for (user of users) {
        u.innerHTML += "<p>" + user + "</p>"
    }
}

chatMessage.disabled = true
sendMessage.disabled = true
