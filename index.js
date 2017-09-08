var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql=require('mysql');

var connection = mysql.createConnection({
	user:'root',
	password:'apmsetup',
	database:'chat'
});

connection.connect();

var e = [];
var n = [];
var p = [];
var s = [];
var cname = [];
var cid = [];
var ecount = 0, ncount = 0, count = 0, kcount = 0, r = -1;
var myname = '';

app.get('/', function(req, res){
	res.sendFile(__dirname + '/main.html');
});

app.use('/www/upload', express.static(__dirname + '/www/upload'));

io.on('connection', function(socket){
	console.log('connect');
	socket.on('join', function(email, nickname, pass, passcon){
		if(pass == passcon){
			var sql1 = 'select * from user'; 
			connection.query(sql1, function (error,result,fields){
				if(result.length > 0){
					for(var i=0; i<result.length; i++){
						e[i] = result[i].email;
						n[i] = result[i].name;
						if(e[i] == email){
							socket.emit('failjoinemail', function(){});
						}
						else
							ecount++;
						if(n[i] == nickname){
							socket.emit('failjoinname', function(){});
						}
						else
							ncount++;
					}
					if(ecount == result.length && ncount == result.length){
						var sql1 = [null, email, nickname, pass, socket.id];
						console.log('success join');
						connection.query('insert into user values(?,?,?,?,?)', sql1, function(error,result,fields){});
							socket.emit('sucjoin');
					}
				}
				else{
					var sql1 = [null, email, nickname, pass, socket.id];
					connection.query('insert into user values(?,?,?,?,?)', sql1, function(error,result,fields){});
					socket.emit('sucjoin');
				}
			});
		}
		else{
			socket.emit('failjoinpass', function(){});
		}
	});
	socket.on('login', function(email, pass){
		connection.query('select * from user', function(error,result,fields){
			for(var k=0 ; k<result.length ; k++){
				e[k] = result[k].email;
				n[k] = result[k].name;
				p[k] = result[k].password;
				s[k] = result[k].socket;
			}
			if(result.length <= 0){
				socket.emit('failloginjoin', function(){});
			}
			for(var c=0 ; c<result.length ; c++){
				if(e[c] == email){
					if(p[c] == pass){
						myname = n[c];
						count++;
						cname[count-1] = n[c];
						cid[count-1] = socket.id;
						socket.emit('suclogin');
						break;
					}
					else{
						socket.emit('failloginpass', function(){});
					}
				}
				else{
					kcount++;
				}
			}
			if(kcount == result.length)
				socket.emit('failloginname', function(sta){});
			kcount = 0;
		});	
	});
	socket.on('ex', function(){
		var con = myname + '님이 입장하셨습니다.';
		io.emit('connected', con, myname);

		io.emit('update', JSON.stringify(cname), count);

		var sql3 = [con, 'null', 'null', 'null'];
		connection.query('insert into chatlog values (?, ?, ?, ?)', sql3, function(error, result, fields){});

		io.to(socket.id).emit('change name', myname);
		socket.on('now', function(name){
			socket.broadcast.emit('writing', name);
		});
		socket.on('finish', function(){
			socket.broadcast.emit('finishm');
		});
		socket.on('disconnect', function() {
			for(var x=0 ; x<count ; x++){
				if(socket.id == cid[x]){
					myname = cname[x];
					break;
				}
			}			
			socket.broadcast.emit('finishm');
			var discon = myname + '님이 퇴장하셨습니다.';
			io.emit('discon', discon);
			var sql3 = [discon, 'null', 'null', 'null'];
			connection.query('insert into chatlog values (?, ?, ?, ?)', sql3, function(error, result, fields){});
			for(var i=0 ; i < count ; i++){
			    if(myname == cname[i]){
				for(var n=i ; n < cname.length-1 ; n++){
				    cname[n] = cname[n+1];
					cid[n] = cid[n+1];
				}
				count--;
				cname[n] = '';
				cid[n] = '';
			    }
			}
			io.emit('update', JSON.stringify(cname), count);   
		});          

		socket.on('whisper', function(name, text, other, time){
			for(var i=0 ; i<count ; i++){
				if(other == cname[i]){	
					var s = name + ' > ' + cname[i];
					var r = cname[i] + ' < ' + name;
					if(name == cname[i]) {
						socket.emit('receive_me_wmessage', r, text, time);
						break;
					}
					else {
						io.to(cid[i]).emit('receive_other_wmessage', s, text, time);
						socket.emit('receive_me_wmessage', r, text, time);
						break;
					}
				}
			}
		});

		socket.on('history', function(name){
			var sql1='select * from chatlog';
			connection.query(sql1, function (error,result,fields) {
				for(var i=0; i<result.length; i++){
					if(result[i].status == 'null'){
						if(name == result[i].name)
							socket.emit('history_chat_m', result[i].name, result[i].message, result[i].time);
						else
							socket.emit('history_chat_o', result[i].name, result[i].message, result[i].time);
						}
					else
						socket.emit('history_status', result[i].status);         
				}
			});
		});
		socket.on('send message', function(name, text, time){
			var sql1='select * from badword';
			connection.query(sql1, function (error,result,fields) {
				for(var i=0; i<result.length; i++){
					while(1){
						if(text.match(result[i].message))
							text=text.replace(result[i].message,"**");
						else
							break;					
					}
				}
				var sql3 = ['null', name, text, time];
				connection.query('insert into chatlog values (?, ?, ?, ?)', sql3, function(error, result, fields){});
				socket.broadcast.emit('receive_other_message', name, text, time);
				socket.emit('receive_me_message',name, text, time);
			});
		});
		socket.on('send map', function(name, latitude, longitude, time){
			console.log('send map');
			socket.broadcast.emit('receive_other_map', name, latitude, longitude, time);
			socket.emit('receive_me_map', name, latitude, longitude, time);
		});
		socket.on('send image', function(name, msg, time){
			socket.broadcast.emit('receive_other_image', name, msg, time);
			socket.emit('receive_me_image', name, msg, time);
		});
	});		
});

http.listen(3000, function(){
console.log('listening on *:3000');
});    
