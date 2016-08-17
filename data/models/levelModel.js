var mongoose = require('mongoose');
var levelSchema = require('../schemas/levelBoards.js');

var levelModel = mongoose.model('levelModel',levelSchema);

module.exports = levelModel;