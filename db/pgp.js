const pgp = require('pg-promise')({});
const dotenv = require('dotenv');
dotenv.load();
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
var cn = {
  host: 'localhost',
  port: 5432,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
}
var db = pgp(cn);

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
        res.rows = data;
        next()
      })
      .catch((err) => {
        res.rows = err;
        console.log('error signing up', err);
      })
  }
}

function loginUser(req,res,next) {
  var email = req.body.email;
  var password = req.body.password;
  db.one("SELECT * from users WHERE email LIKE $1;" ,[email])
    .then ((data) =>{
      console.log("login theb", data);
      if(bcrypt.compareSync(password,data.password_digest)){
        res.rows = data;
        next();
      } else {
        res.status(401).json({data:"password and email do not match"});
         // res.rows = "password and email do not match";
        next();
      }
    })
    .catch((err) => {
      console.log('error finding users', err);
    });
}

module.exports.createUser = createUser;
module.exports.loginUser = loginUser;