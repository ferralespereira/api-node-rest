'user strict'

// Requires
var express = require('express');
var bodyParser = require('body-parser');

// Ejecutar express
var app = express();

// Cargar archivos de ruta
var user_routes = require('./routes/user');

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// CORS

// Reescribir rutas
app.use('/api', user_routes);

// Exportar modulo
module.exports = app;
