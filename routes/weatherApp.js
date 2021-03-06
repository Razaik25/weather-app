require('dotenv').config();
const express = require('express');
const weatherApp = express.Router();
const db = require('../db/pgp');
const request = require('request');
const secret = process.env.SECRET;
const expressJWT = require('express-jwt');
const jwt = require('jsonwebtoken');
const API_KEY = process.env.API_KEY;

weatherApp.use(function (error, request, response, next) {
  if (error.name === 'UnauthorizedError') {
    response.status(401).json({message: 'You need an authorization token to view confidential information.'});
  }
});

weatherApp.use(expressJWT({secret: secret}));

weatherApp.get('/', callOpenWeather, (req, res) => {
  if(result.cod === "404" && result.message ==="city not found") {
    res.status(500).send({message: 'City not Found'})
  } else {
    res.send(result);
  }
});

weatherApp.post('/', db.createLocation, (req, res) => {
  res.send(res.data);
});

weatherApp.get('/getlocations', db.getLocations, (req, res) => {
  res.send(res.data);
});

weatherApp.put('/updatelocation', db.updateLocation, (req, res) => {
  res.send(res.data);
});

weatherApp.delete('/deletelocation', db.deleteLocation, (req, res) => {
  res.send(res.data);
});


function callOpenWeather(req, res, next) {
  request(`http://api.openweathermap.org/data/2.5/weather?q=${req.query.location}&appid=${API_KEY}&units=metric`, (err, response, body) => {
    result = JSON.parse(body);
    next();
  })
}

module.exports = weatherApp;