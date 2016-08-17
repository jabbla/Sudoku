var mongoose = require('mongoose');
var userSchema = require('../schemas/User.js');

var userModel = mongoose.model('userModel',userSchema);

module.exports = userModel;