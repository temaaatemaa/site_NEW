var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('./key.pem');
var certificate = fs.readFileSync('./cert.pem');
var credentials = {key: privateKey, cert: certificate,passphrase:"mephi"};
var express = require('express');
var app = express();
var http = require('http');
var static = require('node-static');
var file = new(static.Server)();
var app = https.createServer(credentials, function (req, res) {
	file.serve(req, res);
}).listen(4321);

var io = require('socket.io').listen(app);

io.sockets.on('connection', function (client) {
    client.on('message', function (message) {
        try {
            client.emit('message', message);
            client.broadcast.emit('message', message);
        } catch (e) {
            console.log(e);
            client.disconnect();
        }
    });
});
