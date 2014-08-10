---
layout: post
title: "android下videoview全屏"
date: 2014-08-10 15:50:20
categories: android 
tags:  android 
---

##写在前面
又是好久没写技术博客了，堕落啊……

这段时间都在写android的native APP，说是写，其实也就打酱油，大部分是另一位同事开发，
N年不看java，连java的基本语法都彻底还给老师了。

##VideoView
android其实还可以，提供了挺多丰富的控件，`VideoView` 就是一个，用来播放视频文件。
但是android默认没有提供全屏方法，惟一有个`MediaController`也只有前进、后退、暂停，
看视频没有全屏怎么能忍？这不能忍！！

在网上搜了好多文章，基本都是我大天朝的特色，同样一篇文章到处抄袭，抄袭就算了，大哥，
你们能不能抄袭点有价值的，很多人抄袭的那篇文章，根本没有解决问题啊！！
让我想起了当年面试腾讯时面试官说的一句话**“东抄西抄，迟早会出问题”**，当年的面试官还是
很有深度啊。

##VideoView全屏之路
我最先想到的，就是`VideoView`能提供一个`enterFullScreen()`的方法，我直接调用就进入全屏；
然后调用`exitFullScreen()`就退出全屏。嗯，世界真美好啊————可惜，没有这两个方法！！

无意中看到网上有篇帖子，说的是把`VideoView`周围的兄弟`View`都隐藏，再设置`VideoView`的宽高
是`fill_parent`，就OK了。我的方法其实和这差不多，我是把`VideoView`放在一个`FrameLayout`
容器里面，然后全屏时，同样把`FrameLayout`周围的兄弟`View`隐藏起来，退出全屏再把周围的兄弟们
召唤出来。测试结果是可行的，但是我的`VideoView`没有自动横屏，我们的需求是希望全屏时，自动
横屏播放（爱奇艺这些客户端都是这样的）。

##VideoView横屏
上面搞定了全屏，接下来是怎么在全屏是自动切换到横屏播放。

嗯，同样，`VideoView`能提供一个旋转的方法，我在全屏时，旋转90°，退出全屏时再旋转回来，嘿嘿，
世界愈发的没好了————骚年，醒醒，貌似`View`是有这个旋转方法，但网上说法是本身旋转了，视频内容
不会自动旋转（我没有测试）。好吧，再想其他曲线救国的方法咯。

扣脑袋扣了两个多小时，硬是把头皮扣了一地的雪花，终于，还是没有搞定！！
妈蛋，android就不能稍微高好一点吗:( 。

晚饭后，旁边同事无意中提到一个，手机屏幕旋转，`orientation`事件，顿时醍醐灌顶之赶脚有木有！！
我的方法是：在进入全屏时，设置`Activity`为强制横屏旋转，然后处理`onConfigurationChange`
事件，当前如果是横屏，则把兄弟们隐藏起来，达到全屏效果；如果是竖屏，再呼朋唤友，实现退出
全屏效果。

coding -> run -> 全屏 -> 退出全屏，OK，全屏时自动横屏（其实应该叫横屏时自动全屏）O啦！

##布局XML

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/LinearLayout1"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    >

    <LinearLayout
        android:id="@+id/common_top_bar"
        android:layout_width="match_parent"
        android:layout_height="50dp"
        android:background="#242021"
        android:orientation="horizontal" >

        <TextView
            android:id="@+id/common_back_text"
            android:layout_width="wrap_content"
            android:layout_height="match_parent"
            android:background="#242021"
            android:clickable="true"
            android:drawableRight="@drawable/english_top_banner_arrow_dark"
            android:gravity="center_vertical"
            android:paddingLeft="20dp"
            android:text="@string/common_back"
            android:textColor="@color/english_top_banner_text_color"
            android:textSize="@dimen/common_back_size" />

        <TextView
            android:id="@+id/common_top_bar_title"
            android:layout_width="wrap_content"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:background="#2d2727"
            android:ellipsize="middle"
            android:gravity="center"
            android:paddingLeft="20dp"
            android:singleLine="true"
            android:text="第一组"
            android:textColor="#d0cfcf"
            android:textSize="20dp" />
    </LinearLayout>

    <FrameLayout
        android:id="@+id/video_wrap"
        android:layout_width="match_parent"
        android:layout_height="wrap_content" >

        <VideoView
            android:id="@+id/videoView1"
            android:layout_width="match_parent"
            android:layout_height="wrap_content" />

    </FrameLayout>

    <TextView
        android:id="@+id/video_desc"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/app_name" />
>

</LinearLayout>

```

##全屏java代码

```java
//进入全屏
public void enterFullScreen(){
    	if( this.isFullScreen ){
			return;
		}
		this.videoSmallWidth = this.videoView.getWidth();
		this.videoSmallHeight = this.videoView.getHeight();
		
		this.isFullScreen = true;
		this.headerBar.setVisibility(View.GONE);
		this.descView.setVisibility(View.GONE);
		LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
					LayoutParams.FILL_PARENT, 
					LayoutParams.FILL_PARENT
				);
		this.videoWrap.setLayoutParams(lp);
		
		DisplayMetrics dm = new DisplayMetrics();
		this.getActivity().getWindowManager().getDefaultDisplay().getMetrics(dm);
		this.videoView.setLayoutParams(new LayoutParams(
					dm.widthPixels, 
					dm.heightPixels
				));
		this.mediaController.setFullScreenText("退出全屏");
		
//		this.getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR);

	}
	
    //退出全屏
	public void exitFullScreen(){
		if( ! this.isFullScreen ){
			return;
		}
		this.isFullScreen = false;
		this.headerBar.setVisibility(View.VISIBLE);
		this.descView.setVisibility(View.VISIBLE);
		LinearLayout.LayoutParams lp = new LinearLayout.LayoutParams(
				LayoutParams.WRAP_CONTENT, 
				LayoutParams.WRAP_CONTENT
			);
		this.videoWrap.setLayoutParams(lp);
		this.videoView.setLayoutParams(new LayoutParams(
				this.videoSmallWidth, 
				this.videoSmallHeight
			));
		
		this.mediaController.setFullScreenText("全屏");
		
//		this.getActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_SENSOR);
	}
```


                                                		-------时2014年8月10日16:26竣工于帝都海淀区魏公村天作国际

