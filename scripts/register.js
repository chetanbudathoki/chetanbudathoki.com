const express = require('express');
const axios = require('axios');
const app = express.Router();
const accountModel = require('../models/accounts');
const verificationCodeModel = require('../models/verificationcode')

app.get('/', (req, res) => {
    res.render('register', {status: 'Account already exists? <a href="/login">Login here</a>'});
});

app.post('/', async (req, res) => {

    const { firstname, lastname, username, password, email, mobile } = req.body;

    //CHECK FOR PRE EXISTING ACCOUNTS
    const account = await accountModel.findOne({
        $or: [{username: username}, {email: email}, {mobile: mobile}]
    });
    if(account) return res.render('register', {status: 'A account with that username already exists. <a href="/login">Login here</a>'});

    //send code
    let randomCode = Math.floor(Math.random() * 999999) + 111111;

    try{
        await axios.post('https://sms.aakashsms.com/sms/v3/send', {
            auth_token: process.env.AAKASHSMS_TOKEN,
            to: mobile,
            text: `Your verification code for youthcongressnepal.org is ${randomCode}.`
        })
    }
    catch(error){
        console.log(error);
        return res.render('register', {status: 'Failed to send verification code. Please try again'});
    }

    //store code in database with upsert
    const verificationCodeEntry = await verificationCodeModel.updateOne(
        { mobile: mobile },
        {
            otp: randomCode,
            firstname: firstname,
            lastname: lastname,
            username: username,
            password: password,
            email: email,
            mobile: mobile,
            createdAt: new Date()
        },
        { upsert: true }
    );
    res.cookie('mobile', mobile, { maxAge: 1000 * 60 * 30, httpOnly: true});

    await verificationCodeEntry.save();

    //render verification page
    res.render('verify', {status: `A Verification code has been sent to ${mobile}.`});
});

app.post('/verify', async (req, res) => {

    const { mobile } = req.cookies;

    // Retrieve user details from the database using the mobile number
    const verificationEntry = await verificationCodeModel.findOne({ mobile: mobile });
    if (!verificationEntry) {
        return res.render('verify', {status: 'Verification code expired or invalid. Please try again. <a href="/register">Register here</a>'});
    }

    const { firstname, lastname, username, password, email, opt } = verificationEntry;
    const { verification_code } = req.body;

    if(verification_code == otp){

        //register in database
        const newUserAccount = new accountModel();
        newUserAccount.firstname = firstname;
        newUserAccount.lastname  = lastname;
        newUserAccount.username  = username;
        newUserAccount.password  = password;
        newUserAccount.email     = email;
        newUserAccount.mobile    = mobile;
        await newUserAccount.save();

        //redirect to home page
        res.redirect('/login');
    }
    else{
        res.render('verify', {status: 'Invalid verification code. Please try again'});
    }
})

module.exports = { app };