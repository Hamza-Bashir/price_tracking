import AppError from "../utilis/AppError.js"
import code from "../constants/httpStatus.js"
import messages from "../constants/messages.js"
import {verifyJwtToken} from "../utilis/jwtToken.js"


const authenticateMiddleware = (req,res,next)=>{
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

import unless from "express-unless"
authenticateMiddleware.unless = unless

export default authenticateMiddleware