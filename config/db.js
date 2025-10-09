const mongoose = require("mongoose")


const db = async ()=>{
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log("Database connected successfully to price tracking DB")
}


module.exports = db