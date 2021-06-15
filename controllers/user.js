'use strict'

var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');

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
    try{
      var validate_name = !validator.isEmpty(params.name);
      var validate_surname = !validator.isEmpty(params.surname);
      var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
      var validate_password = !validator.isEmpty(params.password);
    }catch(err){
      // devolver una respuesta
      return res.status(200).send({
        message: "Faltan datos por enviar"
      });
    }
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
            // Si el usuario no existe

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
  },

  login: function(req, res){
    // recoger los parametros de la peticion
    var params = req.body;

    // validar los datos
  try{
    var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
    var validate_password = !validator.isEmpty(params.password);
  }catch(err){
    // devolver una respuesta
    return res.status(200).send({
      message: "Faltan datos por enviar"
    });
  }

    if(!validate_email || !validate_password){
      // devolver los datos
      return res.status(200).send({
        message: "Los datos son incorrectos, intentelo de nuevo"
      });
    }
    // buscar usuario q coincidan con el email
    User.findOne({email: params.email.toLowerCase()}, (err, user) => {
      if(err){
        // devolver los datos
        return res.status(500).send({
          message: "Error al intentar identificarse"
        });
      }

      if(!user){
        // devolver los datos
        return res.status(404).send({
          message: "El usuario no existe"
        });
      }
      // si lo encuentra,
      // comprobar la contrasena (coincidencia de email y password/bcrypt)
      bcrypt.compare(params.password, user.password, (err, check) => {
        // si es correcto,
        if(check){
            // generar token de jwt y devolverlo
            if(params.gettoken){
              // devolver los datos
              return res.status(200).send({
                token: jwt.createToken(user)
              });
            }else{
              // limpiar el objeto
              user.password = undefined;

              // devolver los datos
              return res.status(200).send({
                message: "success",
                user
              });
            }
        }else{
            // devolver los datos
            return res.status(200).send({
              message: "Las credenciales no son correctas"
            });
        }
      });
    });
  },

  update: function(req, res){

    // recoger los datos del usuario
    var params = req.body;

    // Validar los datos
    try{
      var validate_name = !validator.isEmpty(params.name);
      var validate_surname = !validator.isEmpty(params.surname);
      var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);
      }catch(err){
        // devolver una respuesta
        return res.status(200).send({
          message: "Faltan datos por enviar"
        });
    }

    // eliminar propiedades innecesarias
    delete params.password;

    var userId = req.user.sub;

    // buscar y actualizar documentos
    User.findOneAndUpdate({_id: userId}, params, {new: true}, (err, userUpdated) => {

      if(err){
        // devolver una respuesta
        return res.status(500).send({
          status: 'error',
          message: 'error al actualizar usuario'
        });
      }

      if(!userUpdated){
        // devolver una respuesta
        return res.status(500).send({
          status: 'error',
          message: 'userUpdated error'
        });
      }


      // devolver una respuesta
      return res.status(200).send({
        status: 'success',
        user: userUpdated
      });
    });

  }

};

module.exports = controller;
