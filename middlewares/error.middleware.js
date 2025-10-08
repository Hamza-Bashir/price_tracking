const AppError = require("../utilis/AppError")
const message = require("../constants/messages")

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500
    let messages = err.message || message.SERVER.ERROR

    if(!(err instanceof AppError)){
        statusCode = 500
        messages = message.SERVER.ERROR
    }

    res.status(statusCode).json({
        success:false,
        message
    })
}

module.exports = errorHandler