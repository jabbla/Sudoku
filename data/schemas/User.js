var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	userName: {type: String ,match:/^[a-zA-Z]\w*$/},
	password: {type: String ,match:/^\w{5,17}$/},
	email: {type: String , match:/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/},
	current: {
		mission: String,
		time: Number,
		board: 	Schema.Types.Mixed,
	},
	gameInfo:{
		level1:{
			min: Number,
			avg: Number,
		},
		level2:{
			min: Number,
			avg: Number,
		},
		level3:{
			min: Number,
			avg: Number,
		},
		level4:{
			min: Number,
			avg: Number,
		},
	}
});

module.exports = User;