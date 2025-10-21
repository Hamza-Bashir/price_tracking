import { io } from "socket.io-client"

const socket = io("http://localhost:3000")

socket.on("connect", () => {
    console.log("Connected websocket server")
})

socket.on("priceChanged", (data) => {
    console.log("Price changed notification", data)
})

socket.on("disconnect", () => {
    console.log("Disconnected websocket server")
})