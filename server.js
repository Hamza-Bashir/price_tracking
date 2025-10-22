import {Server} from "socket.io"
import dotenv from "dotenv"
dotenv.config()
import {db} from "./config/db.js"
import axios from "axios"
import cron from "node-cron"
import {checkLatestPrice} from "./services/product/index.js"

import app from "./app.js"

import http from "http"

const server = http.createServer(app)

const io = new Server(server)

io.on("connection", (socket) => {
    console.log("Socket connected successfully")

    socket.on("disconnect", () => {
        console.log("Sockedt disconnected successfully")
    })
})

export {io}

let isRunning = false

cron.schedule("*/5 * * * * *", async () => {

    if(isRunning){
        console.log("Pervious scarping is running")
        return 
    }

    isRunning = true
    await  checkLatestPrice()
    isRunning = false
})

const startServer = ()=>{
    try {
        db()

        server.listen(process.env.PORT, ()=>{
            console.log("Server start successfully")
        })
    } catch (error) {
        console.log(error)
    }
}

startServer()