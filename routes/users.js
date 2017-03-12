require('dotenv').config();
const express = require('express');
const users = express.Router();
const db = require('../db/pgp');
const secret = process.env.SECRET;
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');



users.post('/signup', db.createUser, (req, res)=> {
  var token = jwt.sign(res.rows, SECRET);
  res.json({agent: res.rows, token: token});

});

users.post('/login', db.loginUser, (req, res) => {
  var token = jwt.sign(res.rows, secret);
  res.json({agent: res.rows, token: token});
});


users.use(function (error, request, response, next) {
  if (error.name === 'UnauthorizedError') {
    response.status(401).json({message: 'You need an authorization token to view confidential information.'});
  }
});

users.use('/me', expressJWT({secret: secret}));

module.exports = users;