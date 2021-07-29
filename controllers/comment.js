'use strict'

// var validator = require('validator');
// var Topic = require('../models/topic');

var controller = {

  add: function(req, res){
    return res.status(200).send({
      message: 'Metodo de anadir comentario'
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
