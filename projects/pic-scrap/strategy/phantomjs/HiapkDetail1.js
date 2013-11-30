
var webpage = require('webpage');

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
    var img = document.querySelector('.pic_detail_con .bigpic #pic_detail_fbc img');
    var titleEl = document.querySelector('.pic_detail .pic_detail_t .pic_detail_r h1');
//return { a: img.src};
    return  { width : img.naturalWidth, height : img.naturalHeight, objURL : img.src , title : titleEl.textContent};
}

var page = webpage.create();
page.viewportSize = {
    width : 1680,
    height : 1050
};
page.onError = function( msg, trace ){
    
};
page.open( targetURL, function( status ){
//    console.log(status);
    if( status === 'success'){
	var out = page.evaluate( getImageInfo );
	if( out ){
	    out.fromURL = targetURL;
	    console.log( '[[OUTPUT]]' +  JSON.stringify(out) );
	}else{
	    console.log( '[[ERROR]](out is false)');
	}
    }else{
	console.log( '[[LOADFAIL]](' + targetURL + ')');
    }
    phantom.exit(0);
} );


/*
casper.then( function(){
//console.log(targetURL);
    var picOffset = this.evaluate( getImageInfo );
//    picOffset.fromURL = targetURL;
//    console.log(picOffset.width, picOffset.height, picOffset.objURL, picOffset.desc);
    console.log( '[[OUTPUT]]' + JSON.stringify(picOffset) );
});


casper.run();
*/
