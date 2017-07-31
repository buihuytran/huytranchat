var express=require("express");
var app =express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./views");
var server =require("http").Server(app);
var io =require("socket.io")(server);
server.listen(process.env.PORT ||3000);
var listuser=[];
io.on("connection",function(socket){
	console.log('co nguoi ket noi '+socket.id);
	socket.on("disconnect",function(){
		console.log("Ngat ket noi "+socket.id);
	});
	socket.on("data",function(data){
		//info=JSON.parse(data);
		var dulieu={
			"noi_dung":data,
			"username":socket.username
		}
		var info=JSON.stringify(dulieu);
		io.sockets.emit("data",info);
	});
	socket.on("submit_reg",function(data){
		if(listuser.indexOf(data)>=0){
			socket.emit("dangky_thatbai");
		}else{
			listuser.push(data);
			socket.username=data;
			socket.emit("dangky_thanhcong",data);
			io.sockets.emit("danhsach_username",listuser);
		}
	});
	socket.on("logout",function(){
		listuser.splice(
			listuser.indexOf(socket.username),1
		);
		socket.broadcast.emit("danhsach_username",listuser);

	});
	socket.on("go_chu",function(){
		io.sockets.emit("go_chu","Có người đang soạn tin...");
	});
	socket.on("gung_go_chu",function(){
		io.sockets.emit("gung_go_chu","");
	});
});
app.get("/", function(req,res){
	res.render('trangchu');
});