const express = require('express');
const app = express.Router();

app.get('/', (req, res) => {
    res.send('THIS IS MAIN PROFILE PAGE')
});

app.get('/:username', (req, res) => {

    const username = req.params.username;
    res.render('profile', {username: username});
});

module.exports = { app };