var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var boardSchema = require('./Board.js');

var levelSchema = new Schema({
	level: Number,
	boards: [boardSchema],
});

module.exports = levelSchema