'use strict'

exports.authenticated = function(req, res, next){
    console.log("estas en el middleware");
    next();
};
