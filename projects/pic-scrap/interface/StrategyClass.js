/**
 * 所有strategy类的接口类，固定统一接口
 *
 */

var events = require('events');
var util = require('util');
var _ = require('underscore');
var dataStore = require('../dataStore');

var EventEmitter = events.EventEmitter;

function StrategyClass(){
    EventEmitter.call(this);
}

util.inherits( StrategyClass, EventEmitter);

_.extend( StrategyClass.prototype,  {
//    constructor : StrategyClass, 
    run : function(){}, 
    save : function( data ){
	if( !_.isString(data) ){
	    data = data.toString();
	}
        if( !data || data.indexOf('[[OUTPUT]]') !== 0 ){
            console.log(  data + '(' + this.url + ')' + '(' + __filename + ')' );
            return;
        }
        data = data.replace( '[[OUTPUT]]', '');
        var jsonObj;
        try{
            jsonObj = JSON.parse( data );
            if( !jsonObj || !jsonObj.width || !jsonObj.height || !jsonObj.objURL ){
                throw new Error( data + ' is illegal!');
            }
	    dataStore.save( {
                title : jsonObj.title,
                fromURL : jsonObj.fromURL,
                objURLArray : [ jsonObj.objURL ],
                width : jsonObj.width,
                height : jsonObj.height
            } );
        }catch(e){
            console.log('[StrategyFail]: url(' + this.url + ') strategy(' + __filename + ') message(' + e.message + ')');
        }
    }
});

module.exports = StrategyClass;
