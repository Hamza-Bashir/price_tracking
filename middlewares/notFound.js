import AppError from "../utilis/AppError.js"
import code from "../constants/httpStatus.js"
import messages from "../constants/messages.js"


const notFound = (req,res,next)=>{
    next(new AppError(messages.SERVER.NOT_FOUND, code.NOT_FOUND))
}

export {notFound}