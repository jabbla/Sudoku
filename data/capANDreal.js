
function arg(second,num){
		var k,a;
		if(second>0&&second<=600){
			k=0.9;
		}else if(second>600&&second<=1200){
			k=0.8;
		}else if(second>1200&&second<=1800){
			k=0.7;
		}else if(second>1800&&second<=2400){
			k=0.6;
		}else if(second>2400&&second<=3000){
			k=0.5;
		}else if(second>3000&&second<=3600){
			k=0.4;
		}else{
			k=0.3;
		}
		if(num=='1'){
			a=0;
		}else if(num=='2'){
			a=600;
		}else if(num=='3'){
			a=1200;
		}else if(num=='4'){
			a=1800;
		}
		return {
			k:k,
			a:a
		}
}
function calc(doc,flag){
	var num = doc.current.mission.slice(0,1);
	var second = doc.gameInfo['level'+num][flag=='cap'? 'min':'avg'];
	var args = arg(second,num);
	return args.a + 600 * args.k
}

module.exports = calc;