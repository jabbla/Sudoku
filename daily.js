
/*引入数据库模型*/
var boardModel = require('./data/models/boardModel.js');
var levelModel = require('./data/models/levelModel.js');
var userModel = require('./data/models/userModel.js');
/*引入工具模块*/
var mongoose = require('mongoose');
var _ = require('underscore');
var capANDreal = require('./data/capANDreal.js');
var fs = require('fs');
var map = require('./data/levelMap.js');
/*链接数据库*/
var connectDB = require('./data/main.js');
connectDB();


mongoose.Promise = global.Promise;

var findAll = userModel.find({}).exec();

findAll.then(function(result){
	
	var topTen = {
		level:[],
		cap: [],
		real: [],
	} 
	/*等级排序*/
	var level = result.sort(function(val1,val2){
		return parseInt(val2.current.mission.slice(0,1))-parseInt(val1.current.mission.slice(0,1));
	})
	for (var i = 0; i < 10; i++) {
		var item = level[i],
			tempLevel = {
				userName: item.userName,
				level: map[item.current.mission.slice(0,1)],
			};


		topTen.level.push(tempLevel);	

	}
	/*能力排序*/
	var cap = result.sort(function(val1,val2){
		return capANDreal(val2,'cap')-capANDreal(val1,'cap');
	});
	for (var i = 0; i < 10; i++) {

		var item = cap[i],
			tempCap = {
				userName: item.userName,
				cap: capANDreal(item,'cap'),
			};

		
		topTen.cap.push(tempCap);	

	}
	/*水平排序*/
	var real = result.sort(function(val1,val2){
		return capANDreal(val2,'real')-capANDreal(val1,'real');
	});
	for (var i = 0; i < 10; i++) {
		var item = real[i],
			tempReal = {
				userName: item.userName,
				real: capANDreal(item,'real'),
			};
		
		topTen.real.push(tempReal);	
	}

	return topTen;

}).then(function(topTen){
	console.log(topTen);
	fs.writeFileSync(__dirname+'/data/rank.json',JSON.stringify(topTen));
	console.log('已成功生成排行榜');
}).catch(function(err){
	console.log('出错了'+err);
});
