/**
 * 抓取程序的入口，在这里启动整个程序
 *
 */

var fs = require('fs');
var strategyConf = require('./conf/strategy-conf');


var uriListFile = './uri.txt';
fs.readFile( uriListFile,  { encoding : 'utf8'}, function( err, data ){
    if( err ){
	console.log( err.message );
	process.exit(-1);
    }
    var listArray = data.split('\n');
    for( var i = 0, len = listArray.length; i < len; i++ ){
	var url = ( listArray[i] || '' ).trim();
	if( url ){
	    var strategyName = strategyConf.getStrategy(url);
	    console.log(strategyName);
	}
    }
} );
