// connection/database.js

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error('MONGO_URI is not defined in .env file');
}

// Define dbConnection function
function dbConnection() {
  
  mongoose.connect(uri)
    .then(() => console.log('MongoDB connection established successfully.'))
    .catch(err => console.error('MongoDB connection failed:', err));
  
  return mongoose.connection; // Return the connection object
}

module.exports = dbConnection; // Export the function

// Run connection if this file is executed directly
if (require.main === module) {
  dbConnection();
}