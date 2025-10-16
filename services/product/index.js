import {scrapeDaraz} from "../../services/scraper.js"
import Product from "../../models/product/index.js"
import asyncHandler from "../../utilis/asyncHandler.js"
import AppError from "../../utilis/AppError.js"
import redis from "../../config/redis.js"
import product from "../../models/product/index.js"


const addUrlAndPrice = asyncHandler(async (req,res,next) => {

    console.log("H")
    
    const {url} = req.body

    console.log("A")

    console.log("M")


    console.log("Z")


    const productData = await scrapeDaraz(url)

    console.log("Porduct Data", productData)

    if(!productData){
        return next(new AppError("Product not get", 401))
    }
    

    const saved = await Product.create({
        url : productData.url,
        currentPrice : productData.price,
        oldPrice : productData.price
    })

    await redis.set(url, JSON.stringify(productData))

    console.log(saved)

    res.status(200).json({
        success : true,
        message : "Data fetched successfully",
        data : productData
    })
})

export { addUrlAndPrice }

