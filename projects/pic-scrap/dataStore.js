/**
 * 接收strategy传递的页面抓取结果，将结果保存
 * @author : Jess
 * @date : 2013-11-28
 */

var http = require('http');
var fs = require('fs');

var output;


var singleton = {
    isWriting : false, 
    objList : [], 
    /**
     * obj => { title : 'xxx', fromURL : '', objURLArray : [] }
     */
    save : function( obj ){
//console.log(obj);
	output = process.outputFile;
//console.log(output);
        this.objList.push(obj);
	this.doSave();
    }, 
    doSave : function(){
	if( this.isWriting ){
	    return;
	}
	clearTimeout(this.timer);
	var that = this;
	var obj = this.objList.shift();
	if( !obj ){
	    return;
	}
	this.isWriting = true;
//console.log(obj)
	var objURL = obj.objURLArray[0];
	var width = obj.width;
	var height = obj.height;
	var desc = obj.title;
	var str = objURL + '\t' + obj.fromURL + '\t' + width + '\t' + height + '\t' + desc + '\t' + desc + '\t'
		    + desc + '\t' + desc + '\n';
	fs.appendFile( output, str, function(err){
	    if(err){
		console.log('[SaveFail]' + err);		
	    }
	    that.timer = setTimeout( function(){
		that.doSave();
	    }, 100);
	    that.isWriting = false;
	});
    }
};

module.exports = singleton;
