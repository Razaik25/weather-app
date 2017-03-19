const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const db = require('./db/pgp');
const logger = require('morgan');
const app = express();
const port = process.env.PORT || 3000;

const userRoutes = require('./routes/users');
const weatherAppRoutes = require('./routes/weatherApp');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));


app.use('/users', userRoutes);
app.use('/weatherApp', weatherAppRoutes);

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
