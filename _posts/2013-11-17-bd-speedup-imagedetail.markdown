---
layout: post
title: "优化图片检索中间页"
date: 2013-11-17 16:52:10
categories: javascript 
tags:  javascript baidu-image 
---

去年的这个时候，还是忙的一塌糊涂，印象中搞了好几次夜里1点后打车回家。今年这个时候，却是没啥项目。自己找项目做了只有。看到我们[中间页][detail-demo]加载时间太慢，决定优化下。

首先是干掉多余的请求。去掉1个广告JS，去掉中间页老的suggestion文件，合并中间页检查设置壁纸功能的JS。中间页的suggestion功能，使用common模块的，这样就和结果页共用了common的JS和CSS，增加页面缓存的文件。

然后，网盟广告以前是在页面里同步加载的，会直接阻塞我们页面JS初始化，现在统一改到页面最底部，异步方式载入广告。因为我们页面的主体JS文件，是用FIS异步加载的，韩总希望尽可能加快我们自己JS的加载，于是在head部分，提前F.use了几个模块，但仅仅是use，什么都不做，因为这时候DOM还没OK。

上周四的时候，上面两步已经完成，页面load时间比原来缩短20%以上，用户可操作时间，比原来缩短300ms左右。继续看页面加载时间轴，韩总说要是能缩短JSON请求就好了，因为我们页面初始化时，会以阻塞的方式（同步ajax）请求30或60个JSON，这个东西肯定影响页面的加载时间。改成ajax异步请求？目前的逻辑下不支持。看来这个优化目前没法实现了。没有思路，只有在结果页东点西点，突然想到，其实中间页要的JSON数据，在结果页都已经有了，我们完全可以把结果页的JSON数据传递给中间页，通过浏览器！cookie当然不行，数据量还是比较大，60条JSON呢，那还有什么呢，我只能想到HTML5中的 *localStorage* ，chrome这种高级货当然支持的，而且在我们image的比例已经快接近50%，搜了一下，发现连IE8都支持，又相信爱情了有木有！！！

通过localStorage共享JSON数据，最后实现方案是，在结果页点击缩略图的时候，用该图片的*objURL*作为*key*，该图片所在的JSON块数组作为value来存到localStorage里；中间页加载的时候，尝试通过当前大图的objURL读取localStorage，*读取完之后，立即删除该item*  ，防止localStorage超出容量限制。这周五上线了本方案，明天可以看看周末的统计数据了。

上完线之后，和同事聊了下上面的实现方案，聊着聊着，突然感觉，为什么只传递一个JSON块的数据给中间页呢，结果页请求的JSON数据，一般情况都比中间页多，完全可以全部传递给中间页！！怎么传递呢，考虑到可能受比较大，localStorage估计也不行了，但我们页面是同域的，在中间页可以直接访问结果页的window！是的，用 *window.opener* 可以在中间页访问到结果页（刚开始给同事说用 window.parent ，囧……）。目前只大概想了想，还没有具体写demo测试，看下周有没有时间跟进这个了。

好久没找到这种兴奋了，找到一个点，然后和同事一起，挖掘出更多的思路，这种感觉确实不错。

                                             -------时2013年11月17日18:28竣工于帝都昌平霍营龙跃苑


[detail-demo]: http://image.baidu.com/i?ct=503316480&z=&tn=baiduimagedetail&ipn=d&word=qq&step_word=&ie=utf-8&in=24780&cl=2&lm=-1&st=-1&pn=5&rn=1&di=263334214500&ln=1996&fr=&&fmq=1384683133332_R&ic=0&s=&se=&sme=0&tab=&width=&height=&face=&is=&istype=2&ist=&jit=&objurl=http%3A%2F%2Fwww.01hn.com%2Fpic.asp%3Furl%3Dhttp%3A%2F%2Fwww.2008r.cn%2FUploadFiles%2F2012102214328304.jpg  "中间页链接示例"