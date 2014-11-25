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

//currently running number of tasks
var runningJob = 0
//max concurrent number
var CONCURRENT_NUM = 5;

//callback when a task finishes
function strategyEnd(){
    runningJob--;
    console.log( 'strategyEnd called : ' + runningJob);
}

fs.readFile( uriListFile,  { encoding : 'utf8'}, function( err, data ){
    if( err ){
	console.log( err.message );
	process.exit(-1);
    }
    var listArray = data.split('\n');
    
    function runStrategy(){
	if( runningJob >= CONCURRENT_NUM ){
	    setTimeout( runStrategy, 200 );
	    return;
	}
	if( listArray.length < 1 ){
	    console.log('[[SUCCEED]]' + (new Date()).toLocaleString() );
	    process.exit(0);
	}
	var url = listArray.shift();
	if( url ){
	    if(! (/^http/.test(url) )){
		//casperjs need the url starts with 'http://'  !!! @Jess
		url = 'http://' + url;
	    }
	    var strategy = strategyControl.getStrategy(url);
            if(strategy instanceof StrategyClass){ 
		runningJob++;
		strategy.on( 'end', strategyEnd);
		strategy.run() ;
	    }
	    setTimeout( runStrategy, 100);
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
