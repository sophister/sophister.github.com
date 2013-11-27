/**
 * 抓取程序的入口，在这里启动整个程序
 *
 */

var fs = require('fs');
var strategyControl = require('./strategyControl');
var StrategyClass = require( './interface/StrategyClass' );

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
	    var strategy = strategyControl.getStrategy(url);
	    (strategy instanceof StrategyClass) && ( strategy.run() );
	}
    }
} );
