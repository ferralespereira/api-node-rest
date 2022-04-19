'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');

// adquiero el valor rute_of_frontend_folder del archivo .env
require('dotenv').config();
var secret = process.env.SECRET_KEY;

exports.authenticated = function(req, res, next){

    // comprobar si nos llega autorizacion
    if(!req.headers.authorization){
        return res.status(403).send({
            message: 'No ha enviado el token'
        });
    }

    // limpiar el token y quitar comillas
    var token = req.headers.authorization.replace(/['"]+/g, '');

    try{
      // decodificar el token
      var payload = jwt.decode(token, secret);

      // comprobar si el token ha expirado (comparo la fecha del token con la fecha actual)
      if(payload.exp <= moment.unix()){
        return res.status(404).send({
            message: 'El token ha expirado'
        });
      }

    }catch(err){
      return res.status(404).send({
          message: 'El token no es valido'
      });
    }

    // adjunar usuario identificado a la request
    req.user = payload;

    // pasar a la accion
    next();
};
