const mongoose = require('mongoose');
const {Schema} = mongoose;

const paymentSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    amount: {
        type: Number
    },
    status: {
        type: String,
    },
    productId: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
});

const paymentModel = mongoose.model('product', paymentSchema);
module.exports = paymentModel;