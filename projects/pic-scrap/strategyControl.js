/**
 * 负责返回当前适合的strategy
 *
 */

var strategyConf = require('./conf/strategy-conf');

var singleton = {
    getStrategy : function( url ){
	var strategyClass = strategyConf.getStrategyClass( url );
	var strategyInstance;
	if( strategyClass ){
	    strategyInstance = new strategyClass( url );
	}
	return strategyInstance;
    }
};


module.exports = singleton;
