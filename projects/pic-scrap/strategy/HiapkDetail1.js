/**
 * 本策略仅针对  http://wp.hiapk.com/Pic/309905.html  这类页面生效
 * 
 */

var util = require('util');
var nodeio = require('node.io');
var http = require('http');
var child_process = require('child_process');
var _ = require('underscore');
var StrategyClass = require('../interface/StrategyClass');
var dataStore = require('../dataStore');


function Strategy( url ){
    this.url = url;
    StrategyClass.apply( this, arguments );
}

util.inherits( Strategy, StrategyClass );

_.extend( Strategy.prototype, {
    run : function(){
//	console.log( 'run in ' + __filename );
	var dir = __dirname;
	var that = this;
	var child = child_process.spawn( 'phantomjs', [ dir + '/phantomjs/HiapkDetail1.js', this.url ]);
	child.stdout.on( 'data', function( data ){
	    that.save(data);
	});
	child.stderr.on( 'data', function(){});
	child.on( 'close', function( code ){
	    that.emit( 'end', { code : code });
//	    console.log('child close event triggered');
	});
	child.on( 'error', function( err ){
	    console.error( '[[ERROR]]' + err );
	});
    }
} );

module.exports = Strategy;
