var http = require('http');
var sys = require('sys');
var exec = require('child_process').exec;
var io = require('socket.io');
var fs = require('fs');

var server = http.createServer(function(req, res){
	fs.readFile('interface.html', 'utf8', function(err,data){
		res.end(data);
	})
}).listen(3000);

io = io.listen(server);
io.sockets.on('connection', function(socket){
	io.sockets.emit('connection_status', {status: 'Connection established'});
	socket.on("req", function(data){
		console.log(data);
		exec(data['command'], function(err, stdout, stderr){
			if(err !== null){
				io.sockets.emit("msg",{error : stderr});
			} else {
				io.sockets.emit("msg",{data : stdout});				
			}
		})
	})
});

console.log('listening to port 3000');