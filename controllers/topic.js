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

  getTopics: function(req, res){

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
  },

  getTopicsByUser: function(req, res){

    // conseguir el id del usuario
    var user_id = req.params.user;

    // find los topics de el usuario q se me envia en la peticion
    Topic.find({
      user: user_id
    })
    .sort([['date', 'descending']])
    .exec((err, topics) => {
      if(err){
        // devolver resultado
        return res.status(200).send({
          status: 'error',
          message: 'Error buscado topics.'
        });
      }

      if(!topics){
        return res.status(200).send({
          status: 'error',
          message: 'No se encontraron topics.'
        });
      }

      return res.status(200).send({
        status: 'success',
        message: 'Los topics de este usuario.',
        topics
      });
    });
  },

  getTopic: function(req, res){
    // sacar el id del topic por la url
    var topic_id = req.params.id;

    // Find topic by id
    Topic.findById(topic_id)
         .populate('user')
         .exec((err, topic) => {

           if(err){
             return res.status(500).send({
               status: 'error',
               message: 'No hay topic.'
             });
           }

           if(!topic){
             return res.status(404).send({
               status: 'error',
               message: 'Error buscado topic.'
             });
           }

           return res.status(200).send({
             status: 'success',
             message: 'Soy el getTopic',
             topic
           });
         });
  },

  update: function(req, res){
    // recoger el id del topic en la url
    var topic_id = req.params.id;

    // recoger los datos q llegan desde post
    var params = req.body;

    // validar los datos
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
      // mostrar un json con los datos modificables
      var update = {
        title: params.title,
        content: params.content,
        code: params.code,
        lang: params.lang
      };

      // find and update del topic por id y por el id de usuario
      Topic.findOneAndUpdate({_id: topic_id, user: req.user.sub}, update, {new: true}, (err, topic_updated) => {

        if(err){
          // devolver una respuesta
          return res.status(500).send({
            status: "error",
            message: "error en la peticion"
          });
        }

        if(!topic_updated){
          // devolver una respuesta
          return res.status(404).send({
            status: "error",
            message: "No se ha actualizado el tema"
          });
        }

        // devolver una respuesta
        return res.status(200).send({
          status: "success",
          topic: topic_updated
        });
      });

    }else{
      // devolver una respuesta
      return res.status(400).send({
        status: "error",
        message: "La validacion de los datos no es corrcta"
      });
    }
  },

  delete: function(req, res){
    // sacar el id del topic de la url
    var topic_id = req.params.id;

    // find and delete por topic_id y user_id
    Topic.findOneAndDelete({_id: topic_id, user: req.user.sub}, (err, topic_removed) => {

      if(err){
        // devolver una respuesta
        return res.status(500).send({
          status: "error",
          message: "error en la peticion"
        });
      }

      if(!topic_removed){
        // devolver una respuesta
        return res.status(404).send({
          status: "error",
          message: "No se ha eliminado el tema"
        });
      }

      // devolver respuesta
      return res.status(200).send({
        message: 'Metodo de borrado de temas',
        topic_removed: topic_removed
      });
    });

  },

  search: function(req, res){

    // sacar el string a buscar de la url
    var search_string = req.params.search;

    // find or
    Topic.find({ "$or":[
        {"title": {"$regex": search_string, "$options": "i"}},
        {"content": {"$regex": search_string, "$options": "i"}},
        {"code": {"$regex": search_string, "$options": "i"}},
        {"lang": {"$regex": search_string, "$options": "i"}}
    ]})
    .sort([['date', 'descending']])
    .exec((err, topics) => {

      if(err){
        return res.status(500).send({
          status: "error",
          message: "error en la peticion"
        });
      }

      if(!topics){
        return res.status(404).send({
          status: "error",
          message: "No hay topics disponibles"
        });
      }

      // devolver respuesta
      return res.status(200).send({
        status: 'success',
        topics
      });

    });
 }

};

module.exports = controller;
