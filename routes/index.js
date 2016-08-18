var express = require('express');
var router = express.Router();
var fs = require('fs');


var boardModel = require('../data/models/boardModel.js');
var levelModel = require('../data/models/levelModel.js');
var userModel = require('../data/models/userModel.js');

var promise = require('promise');

/*promise函数*/
var modelSave = function(model,data){
	return new promise(function(resolve,reject){
		model.save(function(err){
			if(err){
				reject(err);
			}else{
				resolve('成功添加记录Level_'+data.level);
			}
		});
	});	
};
var addBoard = function(model,obj,board){
	return new promise(function(resolve,reject){
		model.findOne(obj,function(err,doc){
			if(err){
				reject(err);
			}else{
				board.subLevel = doc.boards.length+1;
				doc.boards.push(board);
				doc.save();
				resolve('成功添加Level_'+obj.level+'—'+doc.boards.length+'关卡');

			}
		});
	});
}
var ModelFind = function(model,obj,data){
	return new promise(function(resolve,reject){
		model.find(obj,function(err,docs){
			if(err){
				reject(err);
			}else{
				var board = new boardModel({subLevel: 1 ,board: data.board});
				if(docs.length===0){
					//添加level记录
					console.log('需添加Level_'+data.level+'的记录');
					//创建一个level实例
					var level = new levelModel({level: data.level, boards: [board]});

					resolve(modelSave(level,data));
				}else{
					//更新level记录
					console.log('需更新Level_'+data.level+'的记录');
					resolve(addBoard(levelModel,{level:data.level},board));
				}
			}
		});
	});
};
var readRank = function(data1){
	return new promise(function(resolve,reject){
		fs.readFile(__dirname+'/../data/rank.json','utf-8',function(err,data){
			if(err){
				reject(err)
			}else{
				var temp = {
					userName: data1.userName,
					password: data1.password,
					email: data1.email,
					gameInfo: data1.gameInfo,
					current: data1.current,
					rankInfo: JSON.parse(data),
				}
				
				resolve(temp);
			}
		})
	})	
}
/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req);
  res.sendFile(__dirname.slice(0,-6)+'/index.html');
});
/*后台管理*/
router.get('/admin',function(req, res, next) {
  res.sendFile(__dirname.slice(0,-6)+'/admin.html');
});
	/*后台管理添加棋盘*/
	router.post('/admin/add_board',function(req, res, next) {
		var data = req.body;
		//修改或添加level记录
		ModelFind(levelModel,{level:data.level},data).then().then(function(info){
			res.send(info);
			console.log(info);
		}).catch(function(err){
			res.send('false');
			console.log(err);
		});
	});
/*用户注册*/
var userModel = require('../data/models/userModel.js');

var saveUser = function(data){

	return new promise(function(resolve,reject){
		var user = new userModel({
			userName: data.userName,
			password: data.password,
			email: data.email,
			current: {
				mission: '1-1',
				time: 0,
				board: {},
			},
			gameInfo:{
				level1:{
					min: 0,
					avg: 0,
				},
				level2:{
					min: 0,
					avg: 0,
				},
				level3:{
					min: 0,
					avg: 0,
				},
				level4:{
					min: 0,
					avg: 0,
				},
			}
		});
		user.save(function(err,doc){
			if(err){
				reject(err);
			}else{
				resolve(doc);
			}
		});
	});
}
router.post('/signup',function(req,res,next){
	//保存到数据库
	var data = req.body;
	saveUser(data).then(function(doc){
		return readRank(doc);
	}).then(function(doc){
		res.cookie('user',doc);
		res.send(doc);
	}).catch(function(err){
		res.send(false);
		console.log(err);
	});
	//保存后返回消息
	console.log(req.body);
});
router.post('/exist',function(req,res,next){
	var data = req.body;
	console.log(data);
	findModel(data).then(function(result){
		res.sendStatus(404);
	}).catch(function(err){
		console.log(err);
		res.sendStatus(200);
	})
})
/*用户登录*/
var findModel = function(data){
	return new promise(function(resolve,reject){
		userModel.findOne(data,function(err,result){
			if(err){
				reject(-1);
			}else if(result===null){
				reject(-1);
			}else{
				resolve(result);
			}
		});
	});
}
router.post('/signin',function(req,res,next){
	//查找数据库
	var data = req.body;
	findModel(data).then(function(result){
		//读取rank文件
		return readRank(result);
	}).then(function(result){
		res.cookie('user',result);
		res.send(result);
	}).catch(function(err){
		console.log(err);
		res.send(err);
	})
	//查找后返回消息
	console.log(req.body);
});
/*查找棋盘*/
var findInfo = function(data){
	return new promise(function(resolve,reject){
		levelModel.findOne({level:data.level},function(err,doc){
			if(err){
				reject(err);
			}else{
				var result = 0;
				console.log(doc);
				for(var i=0;i<doc.boards.length;i++){
					var subLevel = doc.boards[i].subLevel;
					if(subLevel==data.subLevel){
						result = doc.boards[i].board[0];
						break;
					}
				}
				if(result==0){
					reject();
				}else{
					var userName = data.userName;

					userModel.findOne({userName:userName},function(err,info){
						if(err){
							reject('查找用户失败');
						}else{
							console.log('查找用户成功');
							resolve({board:result,boardInfo:info.current});
						}
					});
				}
			}
		});
	});
}
router.get('/user/findInfo',function(req,res,next){
	//查找数据库
	var data = req.query;

	findInfo(data).then(function(info){
		console.log(info);
		res.send(info);
	}).catch(function(err){
		res.sendStatus(404);
		console.log(404);
	});
	console.log(data);
	//返回消息
});
/*更新路由*/
var findAndUpdate = function(data){
	return new promise(function(resolve,reject){
		var userName = data.userName;
		userModel.findOne({userName:userName},function(err,result){
			if(err){
				reject(err);
			}else{
				result.current.time = data.time;
				result.current.board = data.board;
				result.save(function(err){
					if(err){
						reject(err);
					}else{
						console.log('更新数据成功');
						resolve();
					}
				});	
			}
		});
	});
}
var subLevelNum = function(level,user){
	return new promise(function(resolve,reject){
		levelModel.findOne({level:level},function(err,result){
			if(err){
				reject(err)
			}else{
				var num = result.boards.length;
				console.log('找到子关卡数'+num)
				resolve({user:user,num:num});
			}
		});
	});
}
var findAndUpdate2 = function(data){
	return new promise(function(resolve,reject){
		var userName = data.userName;
		userModel.findOne({userName:userName},function(err,result){
			if(err){
				reject(err);
			}else{
				//查询本level的subLevel数量
				var level = parseInt(result.current.mission.slice(0,1));
				resolve(subLevelNum(level,result));
			}
		});
	});
}
router.post('/user/update',function(req,res,next){
	var data = req.body;
	if(data.complete){
		findAndUpdate2(data).then(function(obj){
			/*更新user*/
			var user = obj.user;
			var num = obj.num;
			//更新user的current字段
			var level = parseInt(user.current.mission.slice(0,1));
			var subLevel = parseInt(user.current.mission.slice(2));
			var time = data.time;

			if(subLevel===num){
				//当前关卡设置为下一level的第一关
				user.current.mission = ((level+1)+'-'+1);
			}else{
				//当前关卡设置为当前level的下一关
				user.current.mission = (level+'-'+(subLevel+1));
			}
				//清空时间和棋盘
				user.current.time = 0;
				user.current.board = {};
			//更新gameInfo字段
			var min = user.gameInfo['level'+level].min;
			var avg = user.gameInfo['level'+level].avg;

			if(min===0 || min>time){
				user.gameInfo['level'+level].min = time;
			}
			user.gameInfo['level'+level].avg = parseInt((avg*(subLevel-1)+time)/subLevel);

			user.save(); 
			res.sendStatus(200);
		}).catch(function(err){
			res.send(404);
		});
	}else{
		//更新user的board和time字段
		findAndUpdate(data).then(function(){
			res.sendStatus(200);
		}).catch(function(err){
			console.log(err);
			res.sendStatus(404);
		});

	}
	console.log(data);
	//返回消息
});
module.exports = router;
