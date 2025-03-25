const express = require('express');
const app = express();
const port = 8001

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('static'));

app.use('/', require('./routes/routes').app);

require('./connection/database').dbConnection();
require('./connection/storage').storageConnection();

app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
});