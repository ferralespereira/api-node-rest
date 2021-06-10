'use strict'

var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');

var controller = {

  probando: function(req, res){
      return res.status(200).send({
        message: "Soy el metodo probando"
      });
  },

  testeando: function(req, res){
      return res.status(200).send({
        message: "Soy el metodo testeando"
      });
  },

  save: function(req, res){
    // Recoger los parametros de la peticion
    var params = req.body;

    // Validar los datos
    var validate_name = !validator.isEmpty(params.name);
    var validate_surname = !validator.isEmpty(params.surname);
    var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
    var validate_password = !validator.isEmpty(params.password);

    // console.log(validate_name, validate_surname, validate_email, validate_password);
    if(validate_name && validate_surname && validate_email && validate_password){
      // Cear el objeto de usuario
      var user = new User();

      // Asignar valores al usuario
      user.name = params.name;
      user.surname = params.surname;
      user.email = params.email.toLowerCase();
      user.password = params.password;
      user.image = null;
      user.role = 'ROLE_USER';

      // Comprobar si el usuario existe
      User.findOne({email: user.email}, (err, issetUser) => {
          if(err){
            return res.status(500).send({
              message: "Error al comprobar duplicidad del usuario"
            });
          }

          if(!issetUser){
            // Si no existe

            // cifrar la contrasena
            bcrypt.hash(params.password, null, null, (err, hash) => {
              user.password = hash;

              // y guardar usuarios
              user.save((err, userStored) => {
                if(err){
                  return res.status(500).send({
                    message: "Error al guardar el usuario"
                  });
                }
                if(!userStored){
                  return res.status(400).send({
                    message: "El usuario no se ha guardado"
                  });
                }

                // Devolver respuesta (devuelvo el usuario q se ha acabado de guardar)
                return res.status(200).send({
                    status: 'success',
                    message: 'Nuevo Usuario',
                    user: userStored
                });

              });//close save
            });//close bcrypt

          }else{
            return res.status(200).send({
              message: "El usuario ya esta registrado"
            });
          }
      });

    }else{
      return res.status(200).send({
        message: "La validacion es incorrecta, intentelo de nuevo"
      });
    }
  }

};

module.exports = controller;
