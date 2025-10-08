const jwt = require("jsonwebtoken")

const signJwtToken = (payLoad, expiresIn = "1d")=>{
    return jwt.sign(payLoad, process.env.JWT_KEY, {expiresIn})
}


const verifyJwtToken = (token)=>{
    try {
        const decode = jwt.verify(token, process.env.JWT_KEY)
        return {decode}
    } catch (error) {
        return {error}
    }
}

module.exports = {signJwtToken, verifyJwtToken}