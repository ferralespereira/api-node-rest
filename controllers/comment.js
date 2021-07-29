'use strict'

var validator = require('validator');
var Topic = require('../models/topic');

var controller = {

  add: function(req, res){
    // Recoger el id del topic de la url
    var topic_id = req.params.topic_id;

    // find por id del topic
    Topic.findById(topic_id).exec((err, topic) => {

      if(err){
        return res.status(500).send({
          status: 'error',
          message: 'error en la peticion'
        });
      }

      if(!topic){
        return res.status(404).send({
          status: 'error',
          message: 'no existe el topic'
        });
      }

      // comprobar objeto usuario y validar datos
      if(req.body.content){

        // validar datos
        try{
          var validate_content = !validator.isEmpty(req.body.content);
        }catch(err){
          // devolver una respuesta
          return res.status(200).send({
            message: 'No has comentado nada'
          });
        }

        if(validate_content){

          var comment = {
            user: req.user.sub,
            content: req.body.content
          };

          // en la propiedad comment de objeto resultante hacer un push
          topic.comments.push(comment);

          // guardar el topic completo
          topic.save((err) => {

            if(err){
              return res.status(500).send({
                status: 'error',
                message: 'error al guardar el comentario'
              });
            }

            return res.status(200).send({
              status: 'success',
              topic: topic
            });

          });


        }else{
          return res.status(200).send({
            message: 'No se han validado los datos'
          });
        }

      }

    });
  },

  update: function(req, res){
    return res.status(200).send({
      message: 'Metodo de update comentario'
    });
  },

  delete: function(req, res){
    return res.status(200).send({
      message: 'Metodo de delete comentario'
    });
  }

};

module.exports = controller;
