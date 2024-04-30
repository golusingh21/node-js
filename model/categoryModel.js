const mongoose = require('mongoose');
const {Schema} = mongoose;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true,
    },
    createAt: {
        type: Date,
    },
    deleteAt: {
        type: Date
    },
    updateAt: {
        type: Date
    }
})
const categoryModel = mongoose.model('category', categorySchema);
module.exports = categoryModel;