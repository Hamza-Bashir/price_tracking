import {scrapeDaraz} from "../../services/scraper.js"
import Product from "../../models/product/index.js"
import asyncHandler from "../../utilis/asyncHandler.js"
import AppError from "../../utilis/AppError.js"
import redis from "../../config/redis.js"


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

    res.status(200).json({
        success : true,
        message : "Data Found Successfully",
        data : existingData
    })
})



export { addUrlAndPrice, getAllUrlData }

