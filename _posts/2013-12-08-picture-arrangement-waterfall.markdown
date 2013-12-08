---
layout: post
title: "图片无限下拉不规则排布"
date: 2013-12-08 21:27:10
categories: javascript baidu-image 
---

好久周末没加班了，上周末去公司加班，开发新版识图。

说到这东西，仍不住吐槽下。说是新版，其实主要就是前段换了一套马甲，后端仍旧是调用VIS的API。为什么要做这个项目呢？之前识图和image是同一个老大的，现在不知道啥原因，识图被拆出去了，所以我们这边要下掉所有原来识图的入口，并且调用他们的API来做一个自己的识图，把流量都截下来，停在image。我个人是真觉得这项目挺搞笑的，同为一个公司的，不能因为他们和我们不是同一个部门了，就不给他们流量，我们这入口一断，老识图基本就没流量了嘛。哎，搞的两边现在就像仇人一样，真的是神仙打架，我们这些底层的小鬼就遭殃了。周末也去赶项目。

好吧，吐槽就到这，说说这次学到的东西吧。

本来我们是完全可以把老识图的前端代码拿过来改改就上的，上半年的识图迁移的时候，我就是把检索端的代码拷过去改。这次想了想，感觉很有必要自己实现一套无限下拉的不规则排布。

基本上还是分为MVC三层： 1、modal层负责向后端请求JSON数据； 2、整个页面有一个 `appControl`，中心控制器，负责处理各种用户输入，比如浏览器resize、用户筛选检索条件、用户下翻scroll等； 3、各种view组件，负责渲染一页图片的 `PageView`，负责渲染尺寸筛选栏的 `SizeFilterView` 和图片类型筛选的 `TypeFilterView` 。

代码结构里，一般情况control都会和model层交互，获取数据，但是目前我的实现方案里，control和model层并不交互，在他们之间，还有一个专门负责计算每一页图片的 `PageCalculator` ，control直接调用 `PageCalculator` 实例，`PageCalculator` 会负责从 model 层获取数据，并且计算下一页的图片，如果一次请求的数据不够一页，会继续向 model 层请求，直到排满一页或者到达最后一个数据，这个时候， `PageCalculator` 会触发(`trigger`) `page.ready` 事件 ，通知 control 完成了下一页图片排布的计算。

页面里还有一些 `strategy` ，这次思想我是从韩总的结果页中借鉴的。一个strategy负责处理一个类型的状态，比如 `ScrollStrategy` 负责计算当前用户的滚动位置，当然不是相对于 `document` 的，是相对于整个图片容器的滚动位置； `FilterStrategy` 负责计算当前用户的筛选条件、是否为默认筛选； `DisplayStrategy` 负责计算当前一行的基础行高，返回当前一行图片的宽度等。这些strategy都是在control中调用，为control服务的。

最后，看下线上的效果吧，<a title="无限下拉不规则排布" target="blank" href="http://image.baidu.com/i?ct=3&querysign=307228916,3428922707&rainbow=1&keyword=%E8%93%9D%E8%89%B2%E6%80%A7%E6%84%9F%E7%9F%AD%E8%A3%99&shituRetNum=25&similarRetNum=600&faceRetNum=0&setnum=0&beautynum=0&imgurl=http://img2.bdstatic.com/img/image/cm28.jpg&resulttn=shituresultpc&tn=simiresultpc&json=shitujson&pn=0&size_filter=0#json=simijson">猛击这里</a>


                                               -------时2013年12月08日21:58竣工于帝都昌平霍营龙跃苑