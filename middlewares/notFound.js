const AppError = require("../utilis/AppError")
const code = require("../constants/httpStatus")
const messages = require("../constants/messages")


const notFound = (req,res,next)=>{
    next(new AppError(messages.SERVER.NOT_FOUND, code.NOT_FOUND))
}

module.exports = notFound