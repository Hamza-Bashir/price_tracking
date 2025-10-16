import joi from "joi"

const addUrlSchema = joi.object({
    url : joi.string().uri().required().messages({
        "string.base": "URL must be string",
        "string.uri":"URL must have http or https",
        "string.empty":"URL must not be empty",
        "any.required":"URL is required"
    })
})

export default addUrlSchema