'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

// adquiero el valor rute_of_frontend_folder del archivo .env
require('dotenv').config();
var secret_key = process.env.SECRET_KEY;


exports.createToken = function(user){

  var payload = {
      sub: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      role: user.role,
      image: user.image,
      iat: moment().unix,
      exp: moment().add(30, 'days').unix
  };

  return jwt.encode(payload, secret_key);

};
