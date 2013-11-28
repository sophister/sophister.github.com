/**
 * 本策略仅针对  http://wallpaper.pconline.com.cn/pic/22946.html  这类页面生效
 * 
 */

var util = require('util');
var nodeio = require('node.io');
var http = require('http');
var Iconv = require('iconv').Iconv;
var iconvLite = require('iconv-lite');
var _ = require('underscore');
var StrategyClass = require('../interface/StrategyClass');

var gbk2utf8 = new Iconv( 'GBK', 'UTF-8//TRANSLIT//IGNORE');

function Strategy( url ){
    this.url = url;
}

util.inherits( Strategy, StrategyClass );

_.extend( Strategy.prototype, {
    run : function(){
	console.log( 'run in ' + __filename );
/*	var that = this;
	var methods = {
	    input : false, 
	    encoding : 'gb2312', 
	    run : function(){
		this.getHtml( that.url, function( err, $, data ){
		    if( err ){
			this.exit(err);
		    }
		    console.log(data);
		    console.log( $('.wrap_bg #J-bitTit h1.photoName').text );
		} );
	    }
	};
	var job = new nodeio.Job( { timeout : 10 }, methods );
	job.run();
*/
/*
	http.get( this.url, function( res ){
	    var buffers = [];
	    var size = 0;
	    res.on( 'data', function(buffer){
		buffers.push(buffer);
		size += buffer.length;
	    });
	    res.on( 'end', function(){
		var buffer = new Buffer(size);
		var pos = 0;
		for( var i = 0, len = buffers.length; i < len; i++ ){
		    buffers[i].copy( buffer, pos );
		    pos += buffers[i].length;
		}
		var utf8_buffer = gbk2utf8.convert(buffer);
		console.log( utf8_buffer.toString() );
	    });
	}).on( 'error', function(){
	    console.log( 'http.get error in ' + __filename);
	});
*/
//	console.log( this.url + '\n');
	http.get( this.url, function( res ){
	    var html = '';
	    res.setEncoding('binary');
	    res.on( 'data', function( chunk ){
		html += chunk;
	    });
	    res.on( 'end', function(){
//		console.log((new Iconv('GBK','UTF-8//TRANSLIT//IGNORE')).convert(new Buffer(html,'binary')).toString());
		var buf = new Buffer( html, 'binary');
		var str = iconvLite.decode( buf, 'gbk');
		console.log(str);
	    });
	});
    }
} );

module.exports = Strategy;
