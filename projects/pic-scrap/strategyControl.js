/**
 * 负责返回当前适合的strategy
 *
 */

var strategyConf = require('strategy-conf');

var singleton = {
    getStrategy : function( url ){
	var strategy;
	
	return strategy;
    }
};


module.exports = singleton;
