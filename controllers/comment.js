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
    // conseguir el id de comentario que llega por la url
    var comment_id = req.params.comment_id;
    console.log(comment_id);

    // recoger los datos
    var params = req.body;

    // validar
    try{
      var validate_content = !validator.isEmpty(params.content);
    }catch(err){
      // devolver una respuesta
      return res.status(200).send({
        message: 'error en validacion'
      });
    }

    if(validate_content){

      // find and update documentos
      Topic.findOneAndUpdate(
        { "comments._id": comment_id },
        {
          "$set":{
            "comments.$.content": params.content
          }
        },
        {new:true},
        (err, topic_updated) => {

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
              message: "No se ha actualizado comment"
            });
          }

          return res.status(200).send({
            status: 'success',
            topic_updated: topic_updated
          });
        });

    }
  },

  delete: function(req, res){
    //  sacar el id del topic y del comentario a borrar
    var topic_id = req.params.topic_id;
    var comment_id = req.params.comment_id;

    // buscar el topic
    Topic.findById(topic_id, (err, topic) =>{
      if(err){
        // devolver una respuesta
        return res.status(500).send({
          status: "error",
          message: "error en la peticion"
        });
      }

      if(!topic){
        // devolver una respuesta
        return res.status(404).send({
          status: "error",
          message: "No se ha encontrado el topic"
        });
      }

      // seleccionar el subdocumento
      var comment = topic.comments.id(comment_id);

      // borrar el comentario
      if(comment){
        comment.remove();

        // guardar el topic
        topic.save((err) => {

          if(err){
            return res.status(500).send({
              status: "error",
              message: "error en la peticion"
            });
          }

          // devolver el resultado
          return res.status(200).send({
            status: 'success',
            topic: topic
          });

        });

      }else{
        // devolver una respuesta
        return res.status(404).send({
          status: "error",
          message: "No existe este comentario el este topic"
        });
      }
    });
  }
  
};

module.exports = controller;
