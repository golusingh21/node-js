const Joi = require('joi');

const userValidation = Joi.object({
    name: Joi.string()
        .required(),
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .required()
        .min(4)
        .max(6)
}).options({abortEarly: false})
module.exports = userValidation