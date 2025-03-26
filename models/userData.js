const { Schema, model } = require('mongoose')

module.exports = model('UserData', new Schema({
    accountId: { type: String, required: true, unique: true },

    about_me: { type: String, default: "No Bio Set" },
    
    permanent_district: { type: String, default: "Please select."},
    permanent_palika: { type: String, default: "Please select."},
    permanent_wada: { type: String, default: "Please select."},
    permanent_tole: { type: String, default: "Please select."},
    temporary_district: { type: String, default: "Please select."},
    temporary_palika: { type: String, default: "Please select."},
    temporary_wada: { type: String, default: "Please select."},
    temporary_tole: { type: String, default: "Please select."},
}))

