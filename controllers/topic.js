'use strict'

var controller = {

  test: function(req, res){
    return res.status(200).send({
      message: 'Una prueba desde el controlador Topic'
    });
  }
};

module.exports = controller;
