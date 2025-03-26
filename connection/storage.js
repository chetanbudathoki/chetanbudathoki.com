const config = require("../config.json")
const Storage = require('minio');

const storageClient = new Storage.Client({
    endPoint: config.MINIO_ENDPOINT,
    port: parseInt(config.MINIO_PORT, 10),
    useSSL: config.MINIO_USE_SSL === 'true',
    accessKey: config.MINIO_ACCESS_KEY,
    secretKey: config.MINIO_SECRET_KEY
    });

function storageConnection() {

  storageClient.listBuckets()
    .then(() => console.log('Storage connection established.'))
    .catch((err) => console.error('Storage connection failed:', err.message));

    return storageClient;
  }
  
module.exports = { storageConnection, storageClient };