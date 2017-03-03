var socket = null;

var backgroundID = "#a1";
var wCanvas = null;
var sketcher = null;
var cachedImage = null;

var reloadSketcher = function() {

	sketcher.clear();
	sketcher = null;
	sketcher = atrament( wCanvas , window.innerWidth , window.innerHeight );

};

var saveImage = function() {
	cachedImage = sketcher.toImage();
	socket.emit( 'cachecanvas' , cachedImage );
};

var setCanvasImage = function(wDataURL) {

	reloadSketcher();
	var wContext = wCanvas.getContext("2d");
	var imageOBJ = new Image();
	imageOBJ.onload = function() {
		wContext.drawImage( this , 0 , 0 );
	}
	imageOBJ.src = wDataURL;

};	


var maximizeElementArea = function(wElementID) {

	var win = $(this);
	var wHeight = win.height();
	$(wElementID).height( wHeight );

};


$(document).ready( function() {

	var messages = [];
	socket = io.connect('http://'+location.host);

	socket.on('message', function (data) {
		if(data.message) {
			console.log(data.message);
			socket.emit( 'replyBack' , "Reply from socketIO-client" );		
		} else {
			console.log("There is a problem:", data);
		}

		if ( data.wCachedCanvas ) {
			setCanvasImage( data.wCachedCanvas );
		}

	});

	socket.on( 'updatecanvas' , function( data ) {
		setCanvasImage( data.wCachedCanvas );
	});
	
	maximizeElementArea( backgroundID );
	
	wCanvas = document.getElementById('mySketcher');
	wCanvas.addEventListener( 'dirty' , function(e) {
		console.info(sketcher.dirty);	
	});

	sketcher = atrament( wCanvas , window.innerWidth , window.innerHeight );

	$(backgroundID).mouseup(function(){
    	saveImage();
	});

	$(backgroundID).on( "touchend" , function(){
    	saveImage();
	});
	
});


$(window).on('resize', function(){

	maximizeElementArea( backgroundID );

});

