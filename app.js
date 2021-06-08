'user strict'

// Requires
var express = require('express');
var bodyParser = require('body-parser');

// Ejecutar express
var app = express();

// Cargar archivos de ruta

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// CORS

// Reescribir rutas

// Ruta/metodo de prueba
app.get('/prueba', (req, res) => {
    return res.status(200).send("<h1>Hola mundo desde el back-end</h1>");
    // return res.status(200).send({
    //   name:'Javier',
    //   message:'Hola mundo desde el back-end with node'
    // });
});

app.post('/prueba', (req, res) => {
    return res.status(200).send({
      name:'Javier',
      message:'Hola mundo desde el back-end with node, metodo POST'
    });
});

// Exportar modulo
module.exports = app;
