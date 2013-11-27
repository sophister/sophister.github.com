/**
 * 本策略仅针对  http://wallpaper.pconline.com.cn/pic/22946.html  这类页面生效
 * 
 */

var util = require('util');
var _ = require('underscore');
var StrategyClass = require('../interface/StrategyClass');

function Strategy( url ){
    this.url = url;
}

util.inherits( Strategy, StrategyClass );

_.extend( Strategy.prototype, {
    run : function(){
	console.log( 'run in ' + __filename );
    }
} );

module.exports = Strategy;
