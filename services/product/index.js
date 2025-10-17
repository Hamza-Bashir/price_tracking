import {scrapeDaraz} from "../../services/scraper.js"
import Product from "../../models/product/index.js"
import asyncHandler from "../../utilis/asyncHandler.js"
import AppError from "../../utilis/AppError.js"
import redis from "../../config/redis.js"



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

export { addUrlAndPrice }

