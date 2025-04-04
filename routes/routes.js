const express = require('express');
const app = express.Router();

app.use('/', require('../scripts/index.js').app);
app.use('/login', require('../scripts/login.js').app);
app.use('/register', require('../scripts/register.js').app);
app.use('/profile', require('../scripts/profile.js').app);
app.use('/assets', require('../scripts/assets.js').app);
app.use('/about', require('../scripts/about.js').app);
app.use('/faqs', require('../scripts/faqs.js').app);
app.use('/contact', require('../scripts/contact.js').app);
app.use('/logout', require('../scripts/logout.js').app);

module.exports = { app };