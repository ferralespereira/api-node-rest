'use strict'

var validator = require('validator');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
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
                user: user
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

    // le hago trim a los datos
    try{
        params.name = (params.name).trim();
        params.surname = (params.surname).trim();
        params.email = (params.email).trim();
    }catch(err){
        // devolver una respuesta
        return res.status(404).send({
          message: 'Faltan datos por enviar'
        });
    }

    // convierto en minuscula el email
    params.email = params.email.toLowerCase();

    // Validar los datos
    var validate_name = !validator.isEmpty(params.name) && validator.isAlpha(params.name);
    var validate_surname = !validator.isEmpty(params.surname) && validator.isAlpha(params.surname);
    var validate_email = !validator.isEmpty(params.email) && validator.isEmail(params.email);

    // si la validacion es correcta
    if(validate_name && validate_surname && validate_email){

      // si voy a cambiar el email verico que no exista uno igual
      if(req.user.email != params.email){

        User.findOne({email: params.email}, function(err, user_found) {
          // si de algun error
          if (err) {
              return res.status(200).send({
                message: 'Error al buscar usuario'
              });
          }
          // si existe un usuario con este correo abandono
          if (user_found){
            return res.status(200).send({
              message: 'No se puede actualizar los datos de este usuario porque este correo ya existe.'
            });
          }else{
            // edito usuario
            controller.editUser(req, res, params);
          }
        });
      }else{
        // edito usuario
        controller.editUser(req, res, params);
      }

    }else{
      return res.status(200).send({
        message: 'Validacion Incorrecta'
      });
    }
  },

  // guardo los nuevos datos
  editUser: function(req, res, params){

    var userId = req.user.sub;

    // buscar y actualizar documentos
    User.findOneAndUpdate({_id: userId}, params, {new: true}, (err, user_Updated) => {

      if(err){
        // devolver una respuesta
        return res.status(500).send({
          status: 'error',
          message: 'error al actualizar usuario'
        });
      }

      if(!user_Updated){
        // devolver una respuesta
        return res.status(500).send({
          status: 'error',
          message: 'userUpdated error'
        });
      }

      // entrego el token con los nuevos datos
      return res.status(200).send({
        status: 'success',
        message: 'User updated.',
        user: user_Updated,
        token: jwt.createToken(user_Updated)
      });
  });
},

  uploadAvatar: function(req, res){
    // configurar el modulo multiparty (md) en routes/user.js (esto es un middleware para valiadar la imagen)

    // recoger el fichero de la peticion
    var file_name = 'Avatar no subido...';
    // console.log(req.files);

    // sino se ha enviado ningun archivo
    if(!req.files.file0){
      // devolver respuesta
      return res.status(404).send({
        status: 'error',
        message: file_name
      });
    }else{
      // conseguir el nombre y la extension del archivo
      var file_path = req.files.file0.path;
      var file_split = file_path.split('/');

      file_name = file_split[2];
      var file_extension = file_split[2].split('.')[1];

      // comprobar la extension de la imagen, si no es una imagen borro el archivo subido
      if(file_extension != 'png' && file_extension != 'jpg' && file_extension != 'JPG' && file_extension != 'jpeg' && file_extension != 'gif'){
        fs.unlink(file_path, (err) => {
          // devolver respuesta
          return res.status(200).send({
            status: 'error',
            message: 'La extension del archivo no es valida.',
            file_path: file_path,
            file_name: file_name,
            file_extension: file_extension
          });
        });
      }else{
        // sacar el id del usuario identificado
        var userId = req.user.sub;

        // buscar y actualizar documento db
        User.findOneAndUpdate({_id: userId}, {image: file_name}, {new: true}, (err, userUpdated) => {
          if(err || !userUpdated){
            // devolver respuesta
            return res.status(500).send({
              status: 'error',
              message: 'Error al guardar el usuario.'
            });
          }
          // devolver respuesta
          return res.status(200).send({
            status: 'success',
            // message: 'Upload avatar.',
            // file_path: file_path,
            // file_name: file_name,
            // file_extension: file_extension,
            user: userUpdated,
            token: jwt.createToken(userUpdated)
          });
        });

      }
    }
  },

  avatar: function(req, res){
    var file_name = req.params.file_name;
    var path_file = './uploads/users/'+file_name;

    fs.exists(path_file, (exists) => {
      if(exists){
        return res.sendFile(path.resolve(path_file));
      }else {
        return res.status(404).send({
          message: 'La imagen no existe'
        });
      }
    });
  },

  getUsers: function(req, res){

    User.find().exec((err, users) => {
      if(err || !users){
        return res.status(404).send({
          status: 'error',
          message: 'No hay usuarios que mostrar.'
        });
      }

      return res.status(200).send({
        status: 'success',
        users
      });

    });
  },

  getUser: function(req, res){
    var user_id = req.params.user_id;

    User.findById(user_id).exec((err, user) => {
      if(err || !user){
        return res.status(404).send({
          status: 'error',
          message: 'No existe el usuario.'
        });
      }

      return res.status(200).send({
        status: 'success',
        user
      });

    });
  }

};

module.exports = controller;
