import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

import { swaggerUi, swaggerSpec } from "./config/swagger.js";

const app = express();


import {routes} from "./routes/index.js"

app.get("/", (req,res) => {
  res.send("Server run successfully")
})

import {errorHandler} from "./middlewares/error.middleware.js"
import {notFound} from "./middlewares/notFound.js"

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/uploads", express.static("uploads")); 

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1", routes);


app.use(notFound);
app.use(errorHandler);

export default app
