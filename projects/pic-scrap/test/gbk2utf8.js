var fs = require('fs');
var iconv = require('iconv-lite');

fs.readFile('./gb2312.txt', function( err, data ){
    if(err){
	console.log(err);
	return;
    }
    console.log(data);
    console.log('\n==============================================');
    var utf8str = iconv.decode( data, 'gbk');
    console.log(utf8str);
});
