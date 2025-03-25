const { Schema, model } = require('mongoose')

module.exports = model('Verification_code', new Schema({
    mobile: {
        type: String,
        required: true,
        unique: true
    },
    opt: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 1000 * 60 * 30
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {   
        type: String,
        required: true
    },
    username: { 
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}))

