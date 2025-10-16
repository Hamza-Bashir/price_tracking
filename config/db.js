import mongoose from "mongoose"


const db = async ()=>{
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log("Database connected successfully")
}


export {db}