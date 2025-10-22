import express from "express"
const router = express.Router()
import {addUrlAndPrice, getAllUrlData, searchUrlData, checkLatestPrice, stopTracking, startTracking} from "../../services/product/index.js"
import validate from "../../middlewares/validate.js"
import addUrlSchema from "../../middlewares/joiValidate/addUrl.js"

/**
 * @swagger
 * /addUrlAndPrice:
 *   post:
 *     summary: Add a product URL and start tracking its price
 *     tags:
 *       - Product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: Full product URL from an e-commerce site (Daraz)
 *                 example: "https://www.daraz.pk/products/example-product-i123456789.html"
 *             required:
 *               - url
 *     responses:
 *       200:
 *         description: Product scraped and saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Data fetched successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       example: "https://www.daraz.pk/products/example-product-i123456789.html"
 *                     price:
 *                       type: string
 *                       example: "Rs. 852"
 *       400:
 *         description: Validation error — e.g., missing or invalid URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["URL is required", "URL must be a valid string", "URL must have http or https", "URL must be string"]
 *       401:
 *         description: Product not fetched from the given URL.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Product not get."
 *       500:
 *         description: Internal server error..
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Internal server error."
 */


router.post("/addUrlAndPrice", validate(addUrlSchema), addUrlAndPrice)



router.get("/getAllData", getAllUrlData)


router.get("/searchData", searchUrlData)

router.get("/latestPriceCheck", checkLatestPrice)

router.post("/stopTracking", validate(addUrlSchema), stopTracking)

router.post("/startTracking", validate(addUrlSchema), startTracking)

export default router