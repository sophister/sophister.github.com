/**
 * 根据URL规则，设置对应的Strategy
 * @author : Jess
 * @date : 2013-11-27
 */

var PCOnlineDetail1 = require('../strategy/PCOnlineDetail1');



var config = [
    {
	strategyClass : PCOnlineDetail1, 
	reg : /http\:\/\/wallpaper\.pconline\.com\.cn\/pic\/\d+\.html/
    }
];

var out = {
    getStrategyClass : function( url ){
	var strategyClass = '';
	for( var i = 0, len = config.length, temp; i < len; i++ ){
	    temp = config[i];
	    if( temp && temp.reg.test(url) ){
		strategyClass = temp.strategyClass;
	    }
	}
	return strategyClass;
    }
};

module.exports = out;
