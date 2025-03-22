const express = require('express');
const app = express.Router();
const accountModel = require('../models/accounts');

app.get('/', (req, res) => {
    res.render('register', {status: 'Account already exists? <a href="/login">Login here</a>'});
});

app.post('/', async (req, res) => {

    const { firstname, lastname, username, password, email, mobile } = req.body;

    //CHECK FOR PRE EXISTING ACCOUNTS
    const account = await accountModel.findOne({username: username});
    if(account) return res.render('register', {status: 'A account with that username already exists. <a href="/login">Login here</a>'});

    //CREATE NEW USER ACCOUNT AND SAVE TO DATABASE
    const newUserAccount = new accountModel();
    newUserAccount.firstname = firstname;
    newUserAccount.lastname  = lastname;
    newUserAccount.username  = username;
    newUserAccount.password  = password;
    newUserAccount.email     = email;
    newUserAccount.mobile    = mobile;
    await newUserAccount.save();

    res.redirect('/login')
})

module.exports = { app };