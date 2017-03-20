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

/*
  Always returns index.html and from that react router takes in and gets the right route
 */
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,'public/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
