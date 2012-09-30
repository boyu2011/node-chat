/*
	server.js

	BoYu (boyu2011@gmail.com)										
*/

var express = require('express'),
    app = express.createServer(), 
	io = require('socket.io').listen(app), 
	fs = require('fs');

app.configure(function() {
    app.use(express.static(__dirname + '/public'));
});

var sys = require('sys')
var exec = require('child_process').exec;
var child;

app.listen(8000);

io.sockets.on('connection', function (socket) {
	
    socket.on('execute_code', function(data) {
      
        /* write code to a file */
        fs.writeFile ( __dirname + '/code.rb', data, function ( err ) {
            if ( err ) {
                console.log (err);
            } else {
                console.log ( "The file was saved." );

                /* execute ruby code, and send result back to client */
                child = exec("ruby code.rb", function (error, stdout, stderr) {
                    if (!error)
                        io.sockets.emit('code_output', socket.username, stdout);   
                    else
                        io.sockets.emit('code_output', socket.username, stderr);
                });
            }
        });
	});
	
	socket.on('disconnect', function() {
	
    });
});
