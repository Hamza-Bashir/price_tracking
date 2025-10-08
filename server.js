require("dotenv").config()

const app = require("./app")

const http = require("http")

const server = http.createServer(app)

const db = require("./config/db")

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