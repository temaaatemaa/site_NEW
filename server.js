var static = require('node-static');
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('./key.pem');
var certificate = fs.readFileSync('./cert.pem');
var credentials = {key: privateKey, cert: certificate,passphrase:"mephi"};

//var httpServer = http.createServer(app2);n


var file = new(static.Server)();
var app = https.createServer(credentials, function (req, res) {
	file.serve(req, res);
}).listen(1234);

var io = require('socket.io').listen(app);

io.sockets.on('connection', function (socket) {
	function log() {
		var array = [">>> "];
		for(var i = 0; i < arguments.length; i++) {
			array.push(arguments[i]);
		}
		socket.emit('log', array);
		console.log('CONNECT'); 
	}

	socket.on('message', function (message) {
		log('Got message: ', message);
		console.log('Got message: ', message);
		console.log('MESSAGE');
		socket.broadcast.emit('message', message); // should be room only
	});

	socket.on('create or join', function (room) {
		var numClients = io.sockets.clients(room).length;
		console.log('JOIN');
		console.log('Room ' + room + ' has ' + numClients + ' client(s)');
		console.log('Request to create or join room', room);
		log('Room ' + room + ' has ' + numClients + ' client(s)');
		log('Request to create or join room', room);

		if(numClients == 0) {
			console.log('JOIN:0');
			socket.join(room);
			socket.emit('created', room);
		} 

		else if(numClients == 1) {
			console.log('JOIN:1');
			io.sockets.in(room).emit('join', room);
			socket.join(room);
			socket.emit('joined', room);
		} 

		else { // max two clients
			socket.emit('full', room);
			console.log('FULL');
		}

		socket.emit('emit(): client ' + socket.id + ' joined room ' + room);
		socket.broadcast.emit('broadcast(): client ' + socket.id + ' joined room ' + room);
	});
});