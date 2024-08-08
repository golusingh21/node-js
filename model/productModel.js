const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    categoryId: {
        type: String,
        required: true
    },
    file: {type: String},
    fileName: {type: String},
    createAt: {
        type: Date,
    },
    deleteAt: {
        type: Date
    },
    updateAt: {
        type: Date
    }
});

const productModel = mongoose.model('product', productSchema);
module.exports = productModel;