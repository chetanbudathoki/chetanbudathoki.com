const express = require('express');
const app = express.Router();

app.get('/', async (req, res) => {
    res.clearCookie('mobile');
    res.clearCookie('loggedIn');
    res.redirect('/');
})

module.exports = {app}