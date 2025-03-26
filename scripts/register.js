const express = require('express');
const axios = require('axios');
const app = express.Router();
const accountModel = require('../models/accounts');
const verificationCodeModel = require('../models/verificationcode')
const config = require("../config.json")

app.get('/', (req, res) => {
    if(req.cookies.loggedIn) return res.redirect(`/profile`);
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
    let otp = Math.floor(Math.random() * 999999) + 111111;
    const message = `Your verification OTP code is ${otp}.  - Youth Congress Nepal, Communication Department`;

    try {
        await axios.post(config.BIRASMS_API_URL, null, {
            params: {
                key: config.BIRASMS_API_KEY,
                campaign: config.BIRASMS_CAMPAIGN,
                contacts: mobile,
                routeid: config.BIRASMS_routeId,
                msg: message
            }
        });
    } catch (error) {
        console.error("Error sending OTP:", error.response?.data || error.message);
        return res.render('register', {status: 'Failed to send verification code. Please try again'});
    }

    //store code in database with upsert
    await verificationCodeModel.updateOne(
        { mobile: mobile },
        {
            otp: otp,
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

    //render verification page
    res.render('verify', {status: `A Verification code has been sent to ${mobile}.`});
});

app.post('/verify', async (req, res) => {

    const { mobile } = req.cookies;
    if(!req.cookies.mobile) return res.render('verify', {status: 'Verification code expired or invalid. Please try again. <a href="/register">Register here</a>'});

    // Retrieve user details from the database using the mobile number
    const verificationEntry = await verificationCodeModel.findOne({ mobile: mobile });
    if (!verificationEntry) {
        return res.render('verify', {status: 'Verification code expired or invalid. Please try again. <a href="/register">Register here</a>'});
    }

    const { firstname, lastname, username, password, email, otp } = verificationEntry;
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

        //later in future.. avoid spamming verification codes. add a counter and block after certain attempts
    }
})

module.exports = { app };