var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server running...');
//console.log(__dirname);


app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');

});

app.use('/chat', function(req, res){
	res.sendFile(__dirname + '/chat.html');

});

	io.sockets.on('connection', function(socket){
		connections.push(socket);
		console.log('Connected: %s socket connected', connections.length);

	// Disconnect
	socket.on('disconnect', function(data){
		users.splice(users.indexOf(socket.username), 1);
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s socket connected', connections.length);
	});

	//Send Message
	socket.on('send message', function(data){
		console.log(data);
		io.sockets.emit('new message', {msg: data, user: socket.username});
	});

	//new user
	socket.on('new user', function(data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updataUsernames();
	});

	function updataUsernames(){
		io.sockets.emit('get users', users);
	};
});

