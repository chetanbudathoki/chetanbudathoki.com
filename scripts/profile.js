const express = require('express');
const app = express.Router();
const accountModel = require('../models/accounts');
const userDataModel = require('../models/userData');
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() });
const { storageClient } = require('../connection/storage')
const config = require("../config.json")

app.get('/', async (req, res) => {

    if(!req.cookies.loggedIn) return res.redirect('/login')
    let account = await accountModel.findOne({_id: req.cookies.loggedIn});
    if(!account) return res.redirect('/')
    res.redirect('/profile/' + account.username)
});

app.get('/:username', async (req, res) => {

    const account = await accountModel.findOne({username: req.params.username});
    if(!account) return res.send('USER NOT FOUND');
    let slu = account._id == req.cookies.loggedIn ? true : false
    let accountData = await userDataModel.findOne({accountId: account._id});
    if(!accountData) {await new userDataModel({accountId: account._id}).save(); 
    accountData = await userDataModel.findOne({accountId: account._id})}

    try {
        const objectStream = await storageClient.getObject(config.MINIO_BUCKET, account._id + '.png');
        let imageChunks = []; for await (const chunk of objectStream) {imageChunks.push(chunk)}
        res.render('profile', { 
            slu,
            req,
            locationData: require('../data/location.json'),
            accountData,
            account, 
            image: `data:image/png;base64,${Buffer.concat(imageChunks).toString('base64')}` 
        });
    } 
    catch (error) {
        res.render('profile', { 
            slu,
            req,
            locationData: require('../data/location.json'),
            accountData,
            account, 
            image: 'https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png' 
        });
    }    
});

app.post('/changeImage', upload.single('pic'), async (req, res) => {

    if(!req.cookies.loggedIn) return res.redirect('/login')
    const account = await accountModel.findOne({_id: req.cookies.loggedIn});
    if(!account) return res.redirect('/login')

    const image = req.file;
    const fileName = req.cookies.loggedIn + '.png';

    try {
        await storageClient.getObject(config.MINIO_BUCKET, fileName);
        await storageClient.removeObject(config.MINIO_BUCKET, fileName);
        await storageClient.putObject(config.MINIO_BUCKET, fileName, image.buffer);
        res.redirect('/profile');
    } 
    catch (error) {
        await storageClient.putObject(config.MINIO_BUCKET, fileName, image.buffer);
        res.redirect('/profile');
    }
});

app.post('/updateLocation', async (req, res) => {

    if(!req.cookies.loggedIn) return res.redirect('/login');
    const account = await accountModel.findOne({_id: req.cookies.loggedIn});
    if(!account) return res.redirect('/login')

    const { permanent_district, permanent_palika, permanent_wada, permanent_tole } = req.body;
    const { temporary_district, temporary_palika, temporary_wada, temporary_tole } = req.body;
    
    await userDataModel.updateOne(
        { accountId: req.cookies.loggedIn },
        {
            permanent_district, permanent_palika, permanent_wada, permanent_tole,
            temporary_district, temporary_palika, temporary_wada, temporary_tole
        },
        { upsert: true }
    )   

    res.redirect('/profile')
});

app.post('/updateUserinfo', async (req, res) => {

    if(!req.cookies.loggedIn) return res.redirect('/login');
    const account = await accountModel.findOne({_id: req.cookies.loggedIn});
    if(!account) return res.redirect('/login')

    const { firstname, lastname, username, email, about_me } = req.body;

    await accountModel.updateOne(
        { _id: req.cookies.loggedIn },
        {
            firstname: firstname,
            lastname: lastname,
            username: username,
            email: email
        },
        { upsert: true }
    )

    await userDataModel.updateOne(
        { accountId: req.cookies.loggedIn },
        {
            about_me: about_me
        },
        { upsert: true }
    )

    res.redirect('/profile')
});

app.post('/changePassword', async (req, res) => {

    if(!req.cookies.loggedIn) return res.redirect('/login');
    const account = await accountModel.findOne({_id: req.cookies.loggedIn});
    if(!account) return res.redirect('/login')

    const { current_password, new_password, verify_password } = req.body;

    if(account.password != current_password){

        return res.send('INCORRECT CURRENT PASSWORD')
    }
    
    if(new_password != verify_password){
        
        return res.send('NEW PASSWORD AND VERIFY PASSWORD DO NOT MATCH')
    }

    await accountModel.updateOne(
        { _id: req.cookies.loggedIn },
        { password: new_password },
        { upsert: true }
    )
    res.redirect('/profile')
});

module.exports = { app };