var mongoose = require('mongoose');
var boardSchema = require('../schemas/Board.js');

var boardModel = mongoose.model('boardModel',boardSchema);

module.exports = boardModel;