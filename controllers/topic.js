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
      topic.user = req.user.sub;

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
  },

  getTopic: function(req, res){

    // cargar la libreria de paginacion en la clase (modelo)

    // indicar las opciones de paginacion
    var page = parseInt(req.params.page);

    if (!page){
      page = 1;
    }

    // indicar las opciones de paginacion
    var options = {
      sort: { date: -1 },
      populate: 'user',
      limit: 5,
      page: page
    };

    // find paginado
    Topic.paginate({}, options, (err, topics) =>{

      if(err){
        // devolver resultado (topis, total de topic)
        return res.status(500).send({
          status: 'error',
          message: 'Error al hacer la consulta.',
          err
        });
      }

      if (!topics){
        return res.status(200).send({
          status: 'notFound',
          message: 'No hay topics.'
        });
      }

      // devolver resultado (topis, total de topic, total de paginas)
      return res.status(200).send({
        status: 'success',
        topics: topics.docs,
        totalDocs: topics.totalDocs,
        totalPages: topics.totalPages,
        limit: topics.limit
      });
    });

  }

};

module.exports = controller;
