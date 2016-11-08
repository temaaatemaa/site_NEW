var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('./key.pem');
var certificate = fs.readFileSync('./cert.pem');
console.log(privateKey);
console.log(certificate);
var credentials = {key: privateKey, cert: certificate,passphrase:"mephi"};
var express = require('express');
var app2 = express();
var path = require('path');
app2.get('/', function(req, res) {
res.sendFile(__dirname +'/'+'index.html'); 
 	console.log('index'); 
});
app2.get('/:name',function(req,res){
	var filename=req.params.name;
	console.log(filename);
	res.sendFile(path.join(__dirname, filename));
});
app2.get('/socket.io/:name',function(req,res){ 
	var filename=req.params.name; 
	console.log(filename); 
	res.sendFile(__dirname +'/socket.io/' + filename); 
});
app2.get('/libs/jquery/:name',function(req,res){ 
	var filename=req.params.name; 
	console.log(filename); 
	res.sendFile(__dirname +'/libs/jquery/' + filename); 
});
app2.get('/libs/bootstrap/css/:name',function(req,res){ 
	var filename=req.params.name; 
	console.log(filename); 
	res.sendFile(__dirname +'/libs/bootstrap/css/' + filename); 
});
var httpServer = http.createServer(app2);
var httpsServer = https.createServer(credentials,app2);
httpServer.listen(8080);
httpsServer.listen(8443);
console.log('Сервер стартовал!');
