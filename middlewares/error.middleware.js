import AppError from "../utilis/AppError.js"
import message from "../constants/messages.js"

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500
  let errorMessage = err.message || message.SERVER.ERROR

  if (!(err instanceof AppError)) {
    statusCode = 500
    errorMessage = message.SERVER.ERROR
  }

  res.status(statusCode).json({
    success: false,
    message: errorMessage
  })
}

export { errorHandler }
