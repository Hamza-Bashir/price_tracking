import express from "express"
const router = express.Router()
import {addUrlAndPrice, getAllUrlData, searchUrlData, checkLatestPrice, stopTracking, startTracking} from "../../services/product/index.js"
import validate from "../../middlewares/validate.js"
import addUrlSchema from "../../middlewares/joiValidate/addUrl.js"

/**
 * @swagger
 * /addUrlAndPrice:
 *   post:
 *     summary: Add a product URL and fetch its current price from Daraz
 *     description: This endpoint scrapes the product data (name, price, etc.) from a given Daraz product URL, saves it to the database, and caches it in Redis for quick access.
 *     tags:
 *       - Product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: Full product URL from the Daraz website.
 *                 example: "https://www.daraz.pk/products/wireless-earbuds-i123456789.html"
 *     responses:
 *       200:
 *         description: Product scraped, saved, and cached successfully.
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
 *                       example: "https://www.daraz.pk/products/wireless-earbuds-i123456789.html"
 *                     name:
 *                       type: string
 *                       example: "Wireless Bluetooth Earbuds"
 *                     price:
 *                       type: string
 *                       example: "Rs. 3,499"
 *
 *       400:
 *         description: Validation error — invalid or missing URL field.
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
 *                   example:
 *                     - "URL is required"
 *                     - "URL must not be empty"
 *                     - "URL must have http or https"
 *                     - "URL must be string"
 *
 *       401:
 *         description: Failed to fetch product data from the given URL.
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
 *                   example: "Product not get"
 *
 *       402:
 *         description: Product already exists in the database.
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
 *                   example: "Data already fetched"
 *
 *       500:
 *         description: Internal server error.
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
router.post("/addUrlAndPrice", validate(addUrlSchema), addUrlAndPrice);



/**
 * @swagger
 * /getAllData:
 *   get:
 *     summary: Get all stored product data
 *     description: This endpoint first checks Redis cache for existing data. If not found, it fetches all product records from the database and returns them.
 *     tags:
 *       - Product
 *     responses:
 *       200:
 *         description: Product data fetched successfully (from Redis cache or database).
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
 *                   example: "Data Found Successfully"
 *                 data:
 *                   oneOf:
 *                     - type: string
 *                       description: Cached data returned from Redis (stringified JSON).
 *                       example: "[{\"_id\":\"6717b9d44e88f93a0a3c8f25\",\"name\":\"Wireless Headphones\",\"currentPrice\":5999}]"
 *                     - type: array
 *                       description: Product data returned from MongoDB.
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "6717b9d44e88f93a0a3c8f25"
 *                           name:
 *                             type: string
 *                             example: "Wireless Headphones"
 *                           url:
 *                             type: string
 *                             example: "https://www.daraz.pk/products/wireless-headphones-i123456789.html"
 *                           currentPrice:
 *                             type: number
 *                             example: 5999
 *                           oldPrice:
 *                             type: number
 *                             example: 5999
 *
 *       401:
 *         description: No data found in Redis or database.
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
 *                   example: "No Data Found"
 *
 *       500:
 *         description: Internal server error.
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
router.get("/getAllData", getAllUrlData);




/**
 * @swagger
 * /searchData:
 *   get:
 *     summary: Search product data by name
 *     description: >
 *       This endpoint allows you to search for products in the database by their **name**.  
 *       It first checks Redis cache using a dynamically generated key (`searchData:<name>`).  
 *       If cached data is found, it returns it instantly.  
 *       Otherwise, it performs a MongoDB regex search (case-insensitive), stores the result in Redis, and returns the fetched data.
 *     tags:
 *       - Product
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The product name (or part of it) to search for.
 *         example: "headphones"
 *     responses:
 *       200:
 *         description: Product data found successfully (from cache or database).
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
 *                   example: "Data Search Successfully"
 *                 data:
 *                   type: array
 *                   description: List of matched products.
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6717b9d44e88f93a0a3c8f25"
 *                       name:
 *                         type: string
 *                         example: "Wireless Bluetooth Headphones"
 *                       url:
 *                         type: string
 *                         example: "https://www.daraz.pk/products/wireless-headphones-i123456789.html"
 *                       currentPrice:
 *                         type: number
 *                         example: 5999
 *                       oldPrice:
 *                         type: number
 *                         example: 6999
 *
 *       404:
 *         description: No matching data found for the given name.
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
 *                   example: "Data not exist"
 *
 *       500:
 *         description: Internal server error occurred.
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
router.get("/searchData", searchUrlData);



/**
 * @swagger
 * /stopTracking:
 *   post:
 *     summary: Stop tracking price updates for a specific product
 *     description: >
 *       This endpoint stops price tracking for a specific product by its URL.  
 *       It checks if the product exists in the database, ensures tracking is active,  
 *       then updates the tracking field to `false` and saves the change.
 *     tags:
 *       - Tracking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 description: The full URL of the product to stop tracking.
 *                 example: "https://www.daraz.pk/products/wireless-headphones-i123456789.html"
 *     responses:
 *       200:
 *         description: Tracking stopped successfully.
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
 *                   example: "Tracking stopped successfully"
 *
 *       401:
 *         description: Tracking is already stopped for the given product.
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
 *                   example: "Tracking already stopped"
 *
 *       404:
 *         description: Product not found for the given URL.
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
 *                   example: "Product not exist"
 *
 *       400:
 *         description: Validation error — missing or invalid URL format.
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
 *                   example: ["URL must have http or https", "URL must not be empty", "URL is required"]
 *
 *       500:
 *         description: Internal server error.
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
router.post("/stopTracking", validate(addUrlSchema), stopTracking);



/**
 * @swagger
 * /startTracking:
 *   post:
 *     summary: Start product tracking
 *     description: This endpoint starts tracking a product’s price by providing its valid URL. The URL must already exist in the database.
 *     tags:
 *       - Tracking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: Product URL that should be tracked. Must include http or https.
 *                 example: "https://www.daraz.pk/products/wireless-headphones-i123456789.html"
 *     responses:
 *       200:
 *         description: Product tracking started successfully.
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
 *                   example: "Product tracking start"
 *
 *       400:
 *         description: Invalid URL format or validation error.
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
 *                   example: ["URL must have http or https", "URL must not be empty", "URL is required"]
 *
 *       401:
 *         description: Product is already being tracked.
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
 *                   example: "Product already tracking"
 *
 *       404:
 *         description: Product not found in the database.
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
 *                   example: "Product not exist"
 *
 *       500:
 *         description: Internal server error.
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
 *                   example: "Internal server error"
 */

router.post("/startTracking", validate(addUrlSchema), startTracking);


export default router