const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    googleId: {
        type: String
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    deleteAt: {
        type: Date
    },
    updateAt: {
        type: Date,
        default: Date.now
    }
})
const userModel = mongoose.model('user', userSchema)
module.exports = userModel;