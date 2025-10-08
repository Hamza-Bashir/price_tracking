const AppError = require("../utilis/AppError")
const code = require("../constants/httpStatus")
const messages = require("../constants/messages")
const {verifyJwtToken} = require("../utilis/jwtToken")


const authenticate = (req,res,next)=>{
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer')){
        return next(new AppError(messages.AUTH.TOKEN_MISSING, code.NOT_FOUND))
    }

    const token = authHeader.split(" ")[1]

    const {decode, err} = verifyJwtToken(token)

    if(err){
        return next(new AppError(messages.AUTH.TOKEN_INVALID, code.UNAUTHORIZED))
    }

    req.user = decode
    next()
}

const unless = require("express-unless")
authenticate.unless = unless

module.exports = authenticate