require('dotenv').config();
const express = require('express');
const users = express.Router();
const db = require('../db/pgp');
const secret = process.env.SECRET;
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');

users.post('/signup', db.createUser, (req, res)=> {
  res.status(201).json({success: true, data:'success'});
});

users.post('/login', db.loginUser, (req, res) => {
  var token = jwt.sign(res.data, secret);
  res.json({agent: res.data, token: token });
});

users.get('/', expressJWT({ secret: secret }), (req,res)=>{
  res.json({data: 'success'});
});

users.use(function (error, request, response, next) {
  if (error.name === 'UnauthorizedError') {
    response.status(401).json({message: 'You need an authorization token to view confidential information.'});
  }
});

module.exports = users;