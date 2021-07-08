'use strict'

var validator = require('validator');
var Topic = require('../models/topic');

var controller = {

  test: function(req, res){
    return res.status(200).send({
      message: 'Una prueba desde el controlador Topic'
    });
  },

  save: function(req, res){
    // Recoger los parametros de la peticion
    var params = req.body;

    // Validar los datos
    try{
      var validate_title = !validator.isEmpty(params.title);
      var validate_content = !validator.isEmpty(params.content);
      var validate_lang = !validator.isEmpty(params.lang);
    }catch(err){
      // devolver una respuesta
      return res.status(200).send({
        message: "Faltan datos por enviar"
      });
    }

    if(validate_title && validate_content && validate_lang){
      // Cear el objeto de topic
      var topic = new Topic();

      // Asignar valores al topic
      topic.title = params.title;
      topic.content = params.content;
      topic.code = params.code;
      topic.lang = params.lang;

      // y guardar topic
      topic.save((err, topic_stored) => {
        if(err){
          return res.status(500).send({
            message: "Error al guardar el topic"
          });
        }
        if(!topic_stored){
          return res.status(400).send({
            message: "El topic no se ha guardado"
          });
        }

        // Devolver respuesta (devuelvo el topic q se ha acabado de guardar)
        return res.status(200).send({
            status: 'success',
            message: 'Nuevo topic.',
            topic: topic_stored
        });

      });//close save

    }else {
      return res.status(200).send({
        message: 'Validation error.'
      });
    }

  }
};

module.exports = controller;
