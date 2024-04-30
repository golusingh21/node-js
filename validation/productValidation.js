const joi = require('joi');

const productValidation = joi.object({
    name: joi.string().required(),
    status: joi.boolean().required(),
    description: joi.string().required(),
    categoryId: joi.string().required()
}).options({abortEarly: false});

module.exports = productValidation;