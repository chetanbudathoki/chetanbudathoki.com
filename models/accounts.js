const { Schema, model } = require('mongoose')

module.exports = model('User', new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true, },
    mobile: { type: String, required: true, unique: true, },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}))

