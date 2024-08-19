const mongoose = require('mongoose');
const {Schema} = mongoose;

const tokenSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now,
        expires: 3600
    }
})

const tokenModel = mongoose.model('token', tokenSchema);
module.exports = tokenModel;