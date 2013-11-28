/**
 * 抓取程序的入口，在这里启动整个程序
 *
 */

var fs = require('fs');
var strategyControl = require('./strategyControl');
var StrategyClass = require( './interface/StrategyClass' );


var uriListFile = process.argv[2];
var outputFile = process.argv[3];
if( !uriListFile || !fs.existsSync(uriListFile) || !outputFile ){
    console.log('[Usage]: node index.js filename outputFile ');
    process.exit(-1);
}
process.outputFile = outputFile;
fs.readFile( uriListFile,  { encoding : 'utf8'}, function( err, data ){
    if( err ){
	console.log( err.message );
	process.exit(-1);
    }
    var listArray = data.split('\n');
    
    function runStrategy(){
	var url = listArray.shift();
	if( url ){
	    var strategy = strategyControl.getStrategy(url);
            (strategy instanceof StrategyClass) && ( strategy.run() );
	    setTimeout( runStrategy, 500);
	}	
    }
    runStrategy();
/*    for( var i = 0, len = listArray.length; i < len; i++ ){
	var url = ( listArray[i] || '' ).trim();
	if( url ){
	    var strategy = strategyControl.getStrategy(url);
	    (strategy instanceof StrategyClass) && ( strategy.run() );
	}
    }
*/
} );
