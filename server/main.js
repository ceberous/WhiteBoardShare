var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var ejs = require("ejs");

var index = require( "./routes/index" );
var wapi = require( "./routes/wapi" );

var app = express();
var server = require("http").createServer(app);
var port = 5002;

// View Engine Setup
app.set( "views" , path.join( __dirname , "../client" , "views" ) );
app.set( "view engine" , 'ejs' );
app.engine( 'html' , require('ejs').renderFile );

// Set Static Folder
app.use( express.static( path.join( __dirname , "../client"  ) ) );

// Setup Middleware
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );

// Routes
app.use( '/' , index );
app.use( '/api' , wapi );


// Client-Interaction
var io = require('socket.io')(server);
io.sockets.on('connection', function (socket) {
	
	socket.emit('message', { message: 'welcome to the chat' });
	
	socket.on( 'replyBack' , function (data) {
		//io.sockets.emit('message', data);
		console.log(data);
	});


});




server.listen( port , function() {
	console.log( "Server Started on : " + port );
});