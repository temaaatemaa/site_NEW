var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('./key.pem');
var certificate = fs.readFileSync('./cert.pem');
console.log(privateKey);
console.log(certificate);
var credentials = {key: privateKey, cert: certificate,passphrase:"mephi"};
// берём Express

var express = require('express');
// создаём Express-приложение
var app2 = express();
var path = require('path');
// создаём маршрут для главной страницы
// http://localhost:8080/

app2.get('/', function(req, res) {
 res.sendFile(__dirname +'/'+'index.html'); 
 console.log('index'); 
    });
   
app2.get('/:name',function(req,res){

var filename=req.params.name;
console.log(filename);
//if (filename=='') res.sendfile('index.html');
//res.sendFile(__dirname+'/'+filename);
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


/*
app2.get('/', function(req, res) {
res.sendfile('index.html');
});
*/
//app2.listen(8080);
var httpServer = http.createServer(app2);
var httpsServer = https.createServer(credentials,app2);

httpServer.listen(8080);
httpsServer.listen(8443);
// отправляем сообщение
console.log('Сервер стартовал!');
