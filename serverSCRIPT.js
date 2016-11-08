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
}).listen(4444);

var io = require('socket.io').listen(app);

io.sockets.on('connection', function (client) {
    client.on('message', function (message) {
        try {
	        var arr=message.split(';');
	        var metod=arr[0];
	        var eps=arr[1];
	        var x0=arr[2];
	        var x1=arr[3];
	        message='Метод номер: ' + metod;
			client.emit('message', message);
		    message='Эпсилон: ' + eps;
			client.emit('message', message);
		    message='Нач точка: ' + x0;
			client.emit('message', message);		    
		    message='Кон точка: ' + x1;
			client.emit('message', message);
	        
		switch(metod) {
		case '1': { 
			        
		message='Метод секущих!';
		client.emit('message', message);  
		function func(x){
			return 10.5 * Math.pow(x, 5) + 3.12 * Math.pow(x, 4) - 6.25 * Math.pow(x, 3) + 2 * x - 26.7;
		}
		var k = 1;
		var num = 0;
		var x2;
		var dif = Math.abs(x0-x1);
		while (Math.abs(x0-x1)>eps || Math.abs(x0-x1) < dif){
			dif = Math.abs(x0-x1);
			message='Iters: ' + k + 'Root: ' + x0;
			client.emit('message', message);
			k++;
			x2 = x1 - (x1 - x0) * func(x1) / (func(x1) - func(x0));
			x0 = x1;
			x1 = x2;
		}
	        message='Iters: ' + k + 'Epsilon: ' + eps + ' Root: ' + x0;
		}break;
		
		case '2': {
		message='Метод Дихтомии!';
		client.emit('message', message);
		var a=x0;
		var b=x1;
		var c=0;
		var i =0;
		while (b-a>=eps){
		    c=(b+a)/2;
		    fb = 7.22 * Math.pow(b, 5) - 4 * Math.pow(b, 2) + 10.7 * b - 100.2;
		    fc = 7.22 * Math.pow(c, 5) - 4 * Math.pow(c, 2) + 10.7 * c - 100.2;
		    if ( fc*fb <0 )
			a=c;
		     else
			 b=c;
		    i++;
		    message='Iters: ' + i + ' a: ' + a + ' b: '+b;
					client.emit('message', message);
				    client.broadcast.emit('message', message);

		};

		message="the ans is: "+ (a+b)/2;
		}break;

		case '3': {
			message='Метод Ньютона!';
			client.emit('message', message);
			function func(x){
			    return 2.2*Math.pow(x,5) + 10.5*Math.pow(x,4) -7.4*Math.pow(x,3) -  102.1;
			}

			function dev(x){
			   return 2.2*5*Math.pow(x,4) + 10.5*4*Math.pow(x,3) -7.4*3*Math.pow(x,2);
			}

			var xNext=x0;
			var k = 0;
			var xPoint = xNext + 10*eps;
			var delta;
			delta = Math.abs(xPoint - xNext);
			while ((delta > eps) && (func(xPoint) != 0)){
			    k++;
			    xPoint=xNext;
			    xNext=xPoint-func(xPoint)/dev(xPoint);
			    delta = Math.abs(xPoint - xNext);
			    message='Iters: ' + k + 'Root: ' + xPoint;
			    client.emit('message', message);
			    client.broadcast.emit('message', message);
			}
			message='Iters: ' + k + 'Epsilon: ' + eps + 'Root: ' + xPoint;
		}
		break;

		case '4': {

			message='Метод хорд!';
			client.emit('message', message);
			function equation(x) {
			    var y = 21*Math.pow(x,5)-43.3*Math.pow(x,4)+10.2*Math.pow(x,2)-51*x-9.7;
			    return y
			}

			function derivative(x) {
			    var y = 21*5*Math.pow(x,4) - 43.3*4*Math.pow(x,3)+10.2*2*x-51;
			    return y;
			}

			var start_x = x0;
			var prev_x = 1.0;
			var next_x = x1;
			var err=eps;
			if (derivative(start_x)*derivative(next_x) > 0)
			{
			    message='Неправильные данные';
			    client.emit('message', message);
			    return;
			}
			prev_x = start_x;
			var i=0
			while (Math.abs(prev_x - next_x) > err)
			{
			    prev_x = next_x;
			    next_x = (start_x * equation(prev_x) - prev_x * equation(start_x))/(equation(prev_x) - equation(start_x));
			    i++;
			    message='Iters: ' + i + ' Root: ' + next_x;
			    client.emit('message', message);
			    client.broadcast.emit('message', message);
			}
			message='ans: '+next_x;
		}break;

		case '5':{
			message='Метод простой итерации!';
			client.emit('message', message);
			var a = [ 22, -10.3, 5.7, -1.3, -2.2, 3.21 ];
			function Equation(x) {
			    var result =0;
			    for (var i = 0; i < 5; i++)
			    {
				result += a[i] * Math.pow(x, i);
			    }
			    result /= -a[5];
			    if (result > 0)
			    {
				result = Math.pow(result, 0.2);
			    }
			    else
			    {
				result = Math.abs(result);
				result = Math.pow(result, 0.2);
				result = -result;
			    }
			    return result;
			}
			var x=x0;
			var xNext;
			var nIter=1;
			var isContinue = true;
			xNext = Equation(x);
			while (Math.abs(xNext - x) > eps)
			{
			    x = xNext;
			    xNext = Equation(x);
			    message='Iters: ' + nIter + ' Root: ' + xNext;
			    client.emit('message', message);
			    ++nIter;
			}
			message = "The root "+xNext+" has been reached to within "+eps+" after "+nIter+" iterations.\n";
		}break;
		}
			        
         	client.emit('message', message);
        } catch (e) {
            console.log(e);
            client.disconnect();
        }
    });
});
