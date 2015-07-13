var mongoose = require('mongoose');
var config = require('../config');
var userSchema = require('./schemas/user');
var tweetSchema = require('./schemas/tweet');

var db = mongoose.createConnection(config.get('database:host'), config.get('database:name'), config.get('database:port'));

db.model('User', userSchema);
db.model('Tweet', tweetSchema);
module.exports = db;
