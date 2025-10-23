import {scrapeDaraz} from "../../services/scraper.js"
import Product from "../../models/product/index.js"
import asyncHandler from "../../utilis/asyncHandler.js"
import AppError from "../../utilis/AppError.js"
import redis from "../../config/redis.js"
import {io} from "../../server.js"


// -------------------------- addUrlApi ---------------------------

const addUrlAndPrice = asyncHandler(async (req,res,next) => {
    
    const {url} = req.body

    const productData = await scrapeDaraz(url)

    if(!productData){
        return next(new AppError("Product not get", 401))
    }

    const existingData = await Product.findOne({url : productData.url})

    if(existingData){
        return next(new AppError("Data alreday fetched", 402))
    }
    

    await Product.create({
        url : productData.url,
        name : productData.name,
        currentPrice : productData.price,
        oldPrice : productData.price
    })

    await redis.set(url, JSON.stringify(productData))

    res.status(200).json({
        success : true,
        message : "Data fetched successfully",
        data : productData
    })
})


// -------------------------- getAllUrl ---------------------------

const getAllUrlData = asyncHandler(async (req,res,next) => {

    const data = await redis.get("url")

    if(data){
        return res.status(200).json({
            success : true,
            message : "Data Found Successfully",
            data : data
        })
    }
    
    const existingData = await Product.find()

    if(!existingData){
        return next(new AppError("No Data Found", 401))
    }

    await redis.set(url, JSON.stringify(existingData))

    res.status(200).json({
        success : true,
        message : "Data Found Successfully",
        data : existingData
    })
})

// -------------------------- searchUrlData ---------------------------

const searchUrlData = asyncHandler(async (req,res,next) => {

    const {name} = req.query

    const redisKey = `saerchData:${name.toLowerCase()}`

    const data = await redis.get(redisKey)


    if(data){
        return res.status(200).json({
            success : true,
            message : "Data Search Successfully",
            data : JSON.parse(data)
        })
    }


    const existingData = await Product.find({name : {$regex : name, $options : "i"}})

    if(!existingData){
        return next(new AppError("Data not exist", 404))
    }

    await redis.set(redisKey, JSON.stringify(existingData))

    res.status(200).json({
        success : true,
        message : "Data Search Successfully",
        data : existingData
    })

})


// -------------------------- checkLatestPrice ---------------------------

const checkLatestPrice = async () => {

    const products = await Product.find({tracking : true})

    if(products.length === 0){
        return console.log("Product not found")
    }

    let updatedData = []

    for (const product of products){

        const latestData = await scrapeDaraz(product.url)

        if(!latestData.price) {
            return console.log("No latest price")
        }

        latestData.price = product.currentPrice + 100

        if(latestData.price !== product.currentPrice){
            const oldPrice = product.currentPrice
            const newPrice = latestData.price

            product.oldPrice = oldPrice
            product.currentPrice = newPrice

            await product.save()

            updatedData.push({
                name : product.name,
                url : product.url,
                oldPrice,
                newPrice
            })

            io.emit("priceChanged", {
                name : product.name,
                url : product.url,
                oldPrice,
                newPrice,
                message : "Product price changed"
            })

        }

        
    }

    if(updatedData.length === 0){
        return console.log("No price changed")
    }

    console.log("Price changed")
}

// -------------------------- stopTracking ---------------------------

const stopTracking = asyncHandler(async (req,res,next) => {
    const {url} = req.body

    const existingData = await Product.findOne({url})

    if(!existingData){
        return next(new AppError("Product not exist", 404))
    }

    if(existingData.tracking === false){
        return next(new AppError("Tracking already stopped", 401))
    }


    existingData.tracking = false

    await existingData.save()

    res.status(200).json({
        success : true,
        message : "Tracking stopped successfully"
    })
})

// -------------------------- startTracking ---------------------------

const startTracking = asyncHandler(async (req,res,next) => {

    const {url} = req.body

    const existingData = await Product.findOne({url})

    if(!existingData){
        return next(new AppError("Product not exist", 404))
    }

    if(existingData.tracking === true){
        return next(new AppError("Product already tracking", 401))
    }

    existingData.tracking = true

    await existingData.save()

    res.status(200).json({
        success : true,
        message : "Product tracking start"
    })
})

export { addUrlAndPrice, getAllUrlData, searchUrlData, checkLatestPrice, stopTracking, startTracking }

