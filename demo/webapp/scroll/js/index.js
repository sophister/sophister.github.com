/*main js*/

!function( $ ){

	var $win;

	var $main;
	var $loadingLayer;
	var $pageList;
	var $forwardBtn;

	var viewHeight;

	var currentPageIndex = 0;
	var pageSelector = '.page';

	function start(){
		$main.addClass('page-ready');
	}

	var touchStartY = 0;
	var touchEndY = 0;

	function touchStart(e){
		var touch = e.touches[0];
		touchStartY = touch.pageY;
	}

	function touchMove(e){
		var touch = e.touches[0];
		if( touch ){
			touchEndY = touch.pageY;
		}
	}

	function touchEnd(e){
		var dy = touchEndY - touchStartY;
		if( dy < 0 && dy < -25 ){
			forward();
		}else if( dy > 25 ){
			backward();
		}
	}

	function showPage(){
		var y = - currentPageIndex * viewHeight;
		var transformStr = 'translate3d(0,' + y + 'px,0)';
		$pageList.css({
			'transform' : transformStr
		});
	}


	function forward(){
		if( currentPageIndex >= $pageList.children(pageSelector).length - 1 ){
			return;
		}
		currentPageIndex++;
		showPage();
	}

	function backward(){
		if( currentPageIndex <= 0 ){
			return;
		}
		currentPageIndex--;
		showPage();
	}

	$( function(){

		$win = $(window);

		$main = $('#main-wrap');
		$loadingLayer = $('#loading-layer');
		$pageList = $('#page-list');
		$forwardBtn = $('#forward-btn');

		viewHeight = $win.height();

		$pageList.children( pageSelector ).css({
			height : viewHeight + 'px'
		});



		//资源加载完毕，开始显示主页面
		setTimeout( start, 1000 );

	} );


}( Zepto );