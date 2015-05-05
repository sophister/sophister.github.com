---
layout: post
title: "ios中UITabBarController的selectedImage不生效"
date: 2015-05-05 11:47:00
categories: swift 
tags:  ios swift uitabbarcontroller selectedimage
---


##storyboard设置uitabbaritem的selectedImage不生效
今天在写`UITabBarController`的demo，在storyboard里，设置了`UITabBarItem`的`selectedImage`，启动APP后，发现选中的tab bar item的
image会消失，控制台里有错误的warning，说是找不到null的图片资源。

google之后，在<a target="_blank" href="http://stackoverflow.com/questions/27890936/changing-selectedimage-on-uitabbaritem-in-swift/30044042#30044042">stackoverflow</a>和<a target="_blank" href="http://manenko.com/2014/12/14/how-to-set-selected-images-for-uitabbaritem-in-uitabbarcontroller/">这篇博客</a>
上找到点解决办法，是说 storyboard 里设置的 `selectedImage` 有bug，*必须*通过代码设置才能生效。
参照上面的代码设置之后，跑起来，发现还是没生效，无意间看到`UITabBarItem`文档里，写的`selectedImage`貌似要设置`UIImageRenderingMode`才能阻止被系统修改颜色。

##最终代码
我是实现了一个`UITabBarController`的子类，来修复这个问题：

``` swift

import UIKit

class MainTab: UITabBarController {

override func viewDidLoad() {

var tabBar = self.tabBar

var homeSelectImage: UIImage! = UIImage(named: "firstPageSelected")?.imageWithRenderingMode(.AlwaysOriginal)
var qaSelectImage: UIImage! = UIImage(named: "Q&ASelected")?.imageWithRenderingMode(.AlwaysOriginal)
var mySelectImage: UIImage! = UIImage(named: "myBagSelected")?.imageWithRenderingMode(.AlwaysOriginal)

(tabBar.items![0] as! UITabBarItem ).selectedImage = homeSelectImage
(tabBar.items![1] as! UITabBarItem ).selectedImage = qaSelectImage
(tabBar.items![2] as! UITabBarItem ).selectedImage = mySelectImage

tabBar.tintColor = UIColor.greenColor()

}
}


```


                                                		-------时2015年5月5日12:14竣工于帝都回龙观首开智慧社

