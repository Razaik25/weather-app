const pgp = require('pg-promise')({});
const dotenv = require('dotenv');
dotenv.load();
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

let cn;
if (process.env.ENVIRONMENT === 'production') {
  cn = process.env.DATABASE_URL;
} else {
  cn = {
    host: 'localhost',
    port: 5432,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
  };
}

let db = pgp(cn);

function createSecure(email,password,username,callback) {
  bcrypt.genSalt(function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      callback(email, hash, username);
    });
  });
}

function createUser(req,res,next) {
  createSecure(req.body.email, req.body.password, req.body.username, saveUser);
  function saveUser(email, hash, username) {
    db.one("INSERT INTO users (email, password_digest, username) VALUES ($1, $2, $3) RETURNING email, password_digest;",
      [email, hash, username])
      .then((data) => {
        console.log('user created', data);
        res.data = data;
        next()
      })
      .catch((err) => {
        res.data = err;
        if(err.detail.includes("email")) {
          res.status(401).json({data:"This email is already associated with another username"});
        }
        if(err.detail.includes("usernam")) {
          res.status(401).json({data:"This username is already registered"});
        }
        console.log('error signing up', err);
        next();
      })
  }
}

function loginUser(req,res,next) {
  var email = req.body.email;
  var password = req.body.password;
  db.one("SELECT * from users WHERE email =($1);" ,[email])
    .then ((data) =>{
      if(bcrypt.compareSync(password,data.password_digest)){
        res.data = data;
        next();
      } else {
        res.status(401).json({data:"password and email do not match"});
        next();
      }
    })
    .catch((err) => {
      res.status(500).json({data:"error finding users"});
      console.log('error finding users', err);
      next();
    });
}

function getLocations(req,res,next) {
  db.any("SELECT * from users_locations WHERE users_id=($1);" ,[req.user.id])
    .then ((data) =>{
      res.data = data;
      next();
    })
    .catch((err) => {
      res.data = "error";
      console.log('error in getting locations', err);
      next();
    });
}

function createLocation (req, res, next) {
  db.any(`INSERT INTO users_locations(users_id, name, country, weather_desc, icon,
    temp, temp_max, temp_min, wind, humidity,clouds, pressure,location_id,unix_timestamp)
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13,$14)
     RETURNING id`, [req.user.id, req.body.name, req.body.country, req.body.weather_desc, req.body.icon, req.body.temp, req.body.temp_max, req.body.temp_min, req.body.wind, req.body.humidity, req.body.clouds, req.body.pressure, req.body.location_id, req.body.unix_timestamp])
    .then(function(data) {
      res.data = data;
      next();
    })
    .catch(function(error) {
      console.log(error);
      next();
    })
}

function updateLocation (req, res, next) {
  db.many(`UPDATE users_locations SET weather_desc=($1), temp=($2), temp_max=($3), temp_min=($4), wind=($5), humidity=($6), clouds=($7), pressure=($8), unix_timestamp=($9), icon=($10)
    WHERE users_id=($11) and location_id=($12) returning weather_desc, temp,
    temp_max, temp_min,wind,humidity,clouds,pressure,unix_timestamp, icon`,
    [req.body.weather_desc , req.body.temp, req.body.temp_max,
      req.body.temp_min, req.body.wind, req.body.humidity,
      req.body.clouds, req.body.pressure, req.body.unix_timestamp, req.body.icon ,req.user.id, req.body.location_id])
    .then((data) => {
      res.data = data;
      next();
    })
    .catch((error) => {
      console.log("error in updating locations", error);
      next();
    })
}

function deleteLocation (req, res, next) {
  db.one('DELETE FROM users_locations WHERE users_id=($1) and location_id=($2) returning name', [req.user.id, req.body.location_id])
    .then((data) => {
      res.data = data;
      next();
    })
    .catch((error) => {
      console.log("error in deleting locations", error);
      next();
    })
}

module.exports = {
  createUser: createUser,
  loginUser: loginUser,
  getLocations: getLocations,
  createLocation: createLocation,
  deleteLocation: deleteLocation,
  updateLocation: updateLocation
};
