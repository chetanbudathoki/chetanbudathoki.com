const express = require('express');
const app = express.Router();
const accountModel = require('../models/accounts');

app.get('/', (req, res) => {
    if(req.cookies.loggedIn) return res.redirect(`/profile`);
    res.render('login', {status: 'Account does not exists? <a href="/register">Register here</a>'});
});


app.post('/', async (req, res) => {

    const { mobile, password } = req.body;

    //CHECK FOR EXISTING ACCOUNTS
    const account = await accountModel.findOne({mobile: mobile});
    if(!account) return res.render('login', {status: 'You account does not exist. Please register. <a href="/register">Register here</a>'});

    if(account.password !== password) return res.render('login', {status: 'Incorrect password. Please try again.'});

    res.cookie('loggedIn', account._id, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true});
    res.redirect(`/profile/${account.username}`)
})

module.exports = { app };