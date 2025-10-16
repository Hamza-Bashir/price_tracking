import express from "express"
const routes = express.Router()

import product from "../controllers/product/index.js"

routes.use(product)

export {routes}