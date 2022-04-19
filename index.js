'use strict'

var mongoose = require('mongoose');
var app = require('./app');

// adquiero el valor PORT del archivo .env
require('dotenv').config();
// var port = process.env.PORT || 3999;
const port = process.env.PORT;

// corrigiendo error de consola
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
// conecto el proyecto a la base de datos
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/api-rest-node', { useNewUrlParser: true})
        .then(() => {
          console.log('La conexion a la base de datos de mongo se ha realizado correctamente!')
          // Crear el servidor
          app.listen(port, () => {
              console.log(`El servidor HTTP://localhost:${port} esta funcionando`);
          });
        })
        .catch(error => console.log(error));
