'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3999;

// conecto el proyecto a la base de datos
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api-rest-node', { useNewUrlParser: true, useUnifiedTopology: true})
        .then(() => {
          console.log('La conexion a la base de datos de mongo se ha reaizado correctamente!')
          // Crear el servidor
          app.listen(port, () => {
              console.log("El servidor HTTP://localhost:3999 esta funcionando");
          });
        })
        .catch(error => console.log(error));
