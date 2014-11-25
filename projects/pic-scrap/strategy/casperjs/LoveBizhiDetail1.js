
var casper = require('casper').create({
    pageSettings : {
	loadImages : true
    }, 
    viewportSize : {
	width : 1680, 
	height : 1050
    }, 
    logLevel : 'debug', 
    onError : function( err ){
	console.log(err);
    }, 
    onLoadError : function( err ){
	console.log(err);
    }
});
var system = require('system');

var args = system.args;

/*
console.log('===========================');
for( var i = 0; i < args.length; i++ ){
    console.log( args[i] + '\n');
}

phantom.exit();
*/

var targetURL = args[args.length - 1];
var objURL;
var width;

//console.log(targetURL);
function getImageInfo(){
    var img = document.querySelector('.pic .hd img#show');
    var titleEl = document.querySelector('.pic .hd .breadcrumbs a:last-child');
return { a: img.src};
    return  { width : img.naturalWidth, height : img.naturalHeight, objURL : img.src , title : titleEl.text};
}
casper.start( targetURL, function(){
//    this.echo( this.getTitle() );
});

casper.then( function(){
//console.log(targetURL);
    var picOffset = this.evaluate( getImageInfo );
//    picOffset.fromURL = targetURL;
//    console.log(picOffset.width, picOffset.height, picOffset.objURL, picOffset.desc);
    console.log( '[[OUTPUT]]' + JSON.stringify(picOffset) );
});


casper.run();
