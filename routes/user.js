'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var router = express.Router();
var md_auth = require('../middlewares/authenticated');

// para cargar ficheros
// var multipart = require('connect-multiparty');
// var md_upload = multipart({ uploadDir: './uploads/users' });
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/users/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});
const upload = multer({storage: storage});


// Rutas de Prueba
router.get('/probando', UserController.probando);
router.post('/testeando', UserController.testeando);

// Rutas de usuario
router.post('/register', UserController.save);
router.post('/login', UserController.login);
router.put('/user/update', md_auth.authenticated, UserController.update);
router.post('/upload-avatar', [md_auth.authenticated, upload.single('file0')], UserController.uploadAvatar);
router.get('/avatar/:file_name', UserController.avatar);
router.get('/users', UserController.getUsers);
router.get('/user/:user_id', UserController.getUser);

module.exports = router;
