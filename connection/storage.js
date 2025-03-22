require('dotenv').config({ path: '../.env' });
const Storage = require('minio');

const storageClient = new Storage.Client({
    endPoint: process.env.MINIO_ENDPOINT,
    port: parseInt(process.env.MINIO_PORT, 10),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY
});

// Check connection by listing buckets
storageClient.listBuckets()
  .then(() => console.log('Storage connection established.'))
  .catch((err) => console.error('Storage connection failed:', err.message));
  
module.exports = { storageClient };