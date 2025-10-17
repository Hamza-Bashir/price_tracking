import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    url : {
        type : String
    },
    name : {
        type : String
    },
    currentPrice : {
        type : String
    },
    oldPrice : {
        type : String
    },
    lastChecked : {
        type : Date,
        default : Date.now
    }
}, {
    timestamps : true
})


export default mongoose.model("product", productSchema)