import dotenv from "dotenv"
dotenv.config()

import app from "./app.js"

import http from "http"

const server = http.createServer(app)

import {db} from "./config/db.js"

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