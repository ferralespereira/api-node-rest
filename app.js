'use strict'

// Requires
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

// Ejecutar express
var app = express();

// Cargar archivos de ruta
var user_routes = require('./routes/user');
var topic_routes = require('./routes/topic');
var comment_routes = require('./routes/comment');

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// adquiero el valor rute_of_frontend_folder del archivo .env
require('dotenv').config();
var rute_of_frontend_folder = process.env.ROUTE_OF_FRONTEND_FOLDER;

// cargo el frontend 
app.use('/', express.static(rute_of_frontend_folder, {redirect: false}));

// rutas del api-rest (backend)
app.use('/api', user_routes);
app.use('/api', topic_routes);
app.use('/api', comment_routes);

// cuando sea cualquier otra ruta, devuelvo la ruta del index.html (del frontend)
app.get('*', function(req, res, next){
    return res.sendFile(path.resolve(rute_of_frontend_folder+'/index.html'));
});

// Exportar modulo
module.exports = app;
