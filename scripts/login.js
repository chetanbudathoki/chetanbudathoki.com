const express = require('express');
const app = express.Router();

app.get('/', (req, res) => {
    res.render('login');
});

module.exports = { app };