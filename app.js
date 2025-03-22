const express = require('express');
const app = express();
const port = 8001

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes/routes').app);

app.listen(port, () => {
    console.log(`Server is running in port ${port}`);
    });