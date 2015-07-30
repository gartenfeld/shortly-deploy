var Mongoose = require('mongoose');
var path = require('path');

var db = Mongoose.connect('mongodb://localhost:27017/shortlyMongoDb');

module.exports = db;
