/**
 * 所有strategy类的接口类，固定统一接口
 *
 */

function StrategyClass(){}

StrategyClass.prototype = {
    constructor : StrategyClass, 
    run : function(){}
};

module.exports = StrategyClass;
