'use strict'

var mongoose = require('mongoose');
var mongoose_paginate = require('mongoose-paginate-v2');

var Schema = mongoose.Schema;

// Modelo de COMMENT
var CommentSchema = Schema({
    content: String,
    date: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' }
});

var Comment = mongoose.model('Comment', CommentSchema);

// Modelo de TOPIC
var TopicSchema = Schema({
    title: String,
    content: String,
    code: String,
    lang: String,
    date: { type: Date, default: Date.now },
    user: { type: Schema.ObjectId, ref: 'User' },
    comments: [CommentSchema]
});

// cargar paginacion
TopicSchema.plugin(mongoose_paginate);

module.exports = mongoose.model('Topic', TopicSchema);
