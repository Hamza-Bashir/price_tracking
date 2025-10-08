const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
// const routes = require("./routes");


const authenticate = require("./middlewares/auth.middleware");
const { authenticateRoutes } = require("./config/unlessRoutes");
const errorHandler = require("./middlewares/error.middleware");
const notFound = require("./middlewares/notFound");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/uploads", express.static("uploads")); 


app.get("/api/v1/health", (req, res) => {
  res.send("✅ Server is healthy");
});


app.use(authenticate.unless(authenticateRoutes));


// app.use("/api/v1", routes);


app.use(notFound);
app.use(errorHandler);

module.exports = app;
