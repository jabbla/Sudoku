var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var boardSchema = new Schema({
	subLevel: Number,
	board: Array,
});

module.exports = boardSchema;