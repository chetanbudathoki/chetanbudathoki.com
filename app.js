const express = require('express');
const app = express();
const port = 8001

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('static'));
app.use('/', require('./routes/routes').app);

require('./connection/database').dbConnection();

app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
});