const express = require('express');
const app = express.Router();
const { storageClient } = require('../connection/storage')
const config = require("../config.json")

app.get('/:fileName', async (req, res) => {
    try {
        const objectStream = await storageClient.getObject(config.MINIO_BUCKET, req.params.fileName);
        res.setHeader('Content-Type', 'image/png');
        objectStream.pipe(res);
    }
    catch(error){
        console.error('Error fetching image: ', error)
        res.status(404).send("IMAGE NOT FOUND")
    }
});

module.exports = { app };