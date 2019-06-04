var http = require("http");

var fs =require("fs");
var url = require("url");
var path = require("path");

var qs = require("querystring")

var MT={

	"html": "text/html",
	"htm": "text/html",
	"js": "text/javascript",
	"css": "text/css",
	"txt": "text/plain",
	"png": "image/png",
	"jpg": "image/jpeg",
	"jpeg": "image/jpeg",
	"jpe": "image/jpeg",
	"gif": "image/gif"

}

var arr=[
	{
		username:"xiaoming",
		password:"12345"
	},
	{
		username:"xiaoli",
		password:"123456"
	}
]

var server = http.createServer(function(req,res){

	var url_obj=url.parse(req.url,true);
	var pathname=url_obj.pathname;
	var pathobj=path.parse(pathname);
	var query = url_obj.query;
	var method = req.method.toLowerCase();
	//检测是否存在用户名
	if(method === "get" && pathname ==="/checkname"){
		
		var username=query.username;
		console.log(username);
		
		var result=arr.some(function(value){
			return value.username ===username;
		});

		res.setHeader("content-type", "text/plain;charset=utf-8");
		if(result){
			// console.log(JSON);
			res.end(JSON.stringify({
				"error":0,
				"data":"用户名存在"
			}));
			//res.end("用户名存在");
			return;
		}
		res.end(JSON.stringify({
			"data":"1111"
		}));
		return;
	}

	//注册账号
	if(method === "get" && pathname === "/updata"){

		console.log(query);
		arr.push(query);
		console.log(arr);
		res.end("注册成功");
		return;

	}

	if(method === "post" && pathname === "/login"){
		var data="";
		req.on("data",function(data_chunk){
			data +=data_chunk;
		});


		req.on("end",function(){
			var obj =qs.parse(data);
			console.log(obj);
			var username = obj.username;
			var password = obj.password;
			var result = arr.some(function(value){
				return value.username === username && value.password === password;


			});
			res.setHeader("content-type" , "text/plain;charset=utf-8");
			if(result){
				res.end(JSON.stringify({
					error:0,
					data:data,
					arr:arr
				}));
				return;
			}
			res.end("shibai");
			return;
		});
		return;
	}






	if(!pathobj.ext){

		pathname=path.join(pathname,"/index.html");

	}
	var extName = pathname.slice(pathname.lastIndexOf(".")+1);






	fs.readFile("." + pathname,function(err,data){

		if(err){
			res.setHeader("content-type","text/plain;charset=utf-8");
			res.end("不存在");
			return;
		}

		res.setHeader("content-type",MT[extName] + ";charset=tuf-8");
                
		res.end(data);

	});


});



server.listen(3000);










