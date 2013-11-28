/**
 * 本策略仅针对  http://wp.hiapk.com/Pic/309905.html  这类页面生效
 * 
 */

var util = require('util');
var nodeio = require('node.io');
var http = require('http');
var _ = require('underscore');
var StrategyClass = require('../interface/StrategyClass');
var dataStore = require('../dataStore');


function Strategy( url ){
    this.url = url;
}

util.inherits( Strategy, StrategyClass );

_.extend( Strategy.prototype, {
    run : function(){
	console.log( 'run in ' + __filename );
	var that = this;
	var methods = {
	    input : false, 
	    encoding : 'utf8', 
	    run : function(){
		this.getHtml( that.url, function( err, $, data ){
		    if( err ){
			this.exit(err);
		    }
		    try{

			var title = ( $('.pic_detail .pic_detail_con .pic_detail_r h1').first().text );
			var picURL = $('.bigpic #pic_detail_fbc img').attribs.src;
			dataStore.save( {
			    title : title, 
			    fromURL : that.url, 
			    objURLArray : [ picURL ]
			} );
		    }catch(e){
			//TODO  error log 
			console.log('[StrategyFail]: url(' + that.url + ') strategy(' + __filename + ') ');
		    }
		} );
	    }
	};
	var job = new nodeio.Job( { timeout : 10 }, methods );
	nodeio.start(job);;

    }
} );

module.exports = Strategy;
