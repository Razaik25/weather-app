var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var db = require('./db/pgp');
const logger = require('morgan');
let app = express();
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
