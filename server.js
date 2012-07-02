/*
	server.js

	In the server side, the new person's username is attached as data to the socket.
	The server acknowledges the person directly, and then broadcasts the person's name
	to other chat room participants. When the server receives any new chat message,
	it attaches the username to the message, so everyone can see who sent it. Finally,
	when a client disconnects from chat room, another message it broadcast to all connected
	people that the person is no longer participating. 

	BoYu (boyu2011@gmail.com)										
*/

var app = require('http').createServer(handler), 
	io = require('socket.io').listen(app), 
	fs = require('fs');

app.listen(8000);

function handler (req, res) { 
	fs.readFile(__dirname + '/client.html', function (err, data) {
		if (err) { 
			res.writeHead(500);
			return res.end('Error loading client.html'); 
		}
		res.writeHead(200);
		res.end(data); 
	});
}

io.sockets.on('connection', function (socket) {
	
	socket.on('addme',function(username) {
		socket.username = username;
		/* send to the user directly */
		socket.emit('chat', 'SERVER', 'You have connected'); 
		/* broadcast a message to everybody but a specific individual */
		socket.broadcast.emit('chat', 'SERVER', username + ' has joined');
	});

	socket.on('sendchat', function(data) {
		/* send message to all the users */
		io.sockets.emit('chat', socket.username, data);
	});
	
	socket.on('disconnect', function() {
		io.sockets.emit('chat', 'SERVER', socket.username + ' has left');
	});
});