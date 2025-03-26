const config = require("../config.json")
const mongoose = require('mongoose');

const uri = config.MONGO_URI;
if (!uri) {
  throw new Error('MONGO_URI is not defined in .env file');
  }

function dbConnection() {
  
  mongoose.connect(uri)
    .then(() => console.log('MongoDB connection established successfully.'))
    .catch(err => console.error('MongoDB connection failed:', err));
  
  return mongoose.connection; 
  }

module.exports = {dbConnection}; 

if (require.main === module) {
  dbConnection();
}