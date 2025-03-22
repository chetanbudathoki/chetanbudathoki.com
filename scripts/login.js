const express = require('express');
const app = express.Router();
const accountModel = require('../models/accounts');

app.get('/', (req, res) => {
    res.render('login', {status: 'Account does not exists? <a href="/register">Register here</a>'});
});


app.post('/', async (req, res) => {

    const { username, password } = req.body;

    //CHECK FOR EXISTING ACCOUNTS
    const account = await accountModel.findOne({username: username, password: password});
    if(!account) return res.render('login', {status: 'You account does not exist. Please register. <a href="/register">Register here</a>'});
    res.redirect(`/profile/${username}`)
})

module.exports = { app };