

function runDataBase(){
	var mongoose = require('mongoose');
	var db = mongoose.connection;
	var name = 'Gloria';

	db.on('error',console.error.bind(console, 'connection error:'));
	db.on('open',function(callback){
		console.log(name+'数据库成功打开...');
	});
	mongoose.connect('mongodb://localhost/'+name);	
}
module.exports = runDataBase;