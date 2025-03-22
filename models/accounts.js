const { Schema, model } = require('mongoose')

module.exports = model('User', new Schema({
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

