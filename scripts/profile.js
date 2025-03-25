const express = require('express');
const app = express.Router();
const accountModel = require('../models/accounts');
const multer = require('multer')
const upload = multer({ storage: multer.memoryStorage() });
const { storageClient } = require('../connection/storage')

app.get('/', async (req, res) => {

    if(!req.cookies.loggedIn) return res.redirect('/login')
    let account = await accountModel.findOne({_id: req.cookies.loggedIn});
    if(!account) return res.redirect('/')
    res.redirect('profile/' + account.username)
});

app.get('/:username', async (req, res) => {

    const account = await accountModel.findOne({username: req.params.username});
    if(!account) return res.send('USER NOT FOUND');
    
    let slu = account._id == req.cookies.loggedIn ? true : false
    //if slu true show edits buttons if false hide them

    try {
        const objectStream = await storageClient.getObject(process.env.MINIO_BUCKET, account._id + '.png');
        let imageChunks = [];
        for await (const chunk of objectStream) {imageChunks.push(chunk)}
        let image = Buffer.concat(imageChunks).toString('base64')
        res.render('profile', { slu, account, image: `data:image/png;base64,${Buffer.concat(imageChunks).toString('base64')}` });
    } 
    catch (error) {
        res.render('profile', { slu, account, image: 'https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png' });
    }    
});

app.post('/changeImage', upload.single('pic'), async (req, res) => {

    if(!req.cookies.loggedIn) return res.redirect('/login')

    const image = req.file;
    const fileName = req.cookies.loggedIn + '.png';

    try {
        await storageClient.getObject(process.env.MINIO_BUCKET, fileName);
        await storageClient.removeObject(process.env.MINIO_BUCKET, fileName);
        await storageClient.putObject(process.env.MINIO_BUCKET, fileName, image.buffer);
        res.redirect('/profile');
    } 
    catch (error) {
        await storageClient.putObject(process.env.MINIO_BUCKET, fileName, image.buffer);
        res.redirect('/profile');
    }
});

module.exports = { app };