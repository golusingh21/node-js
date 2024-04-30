const joi = require('joi');

const categoryValidation = joi.object({
    name: joi.string().required(),
    status: joi.boolean().required()
}).options({abortEarly: false})
module.exports = categoryValidation;