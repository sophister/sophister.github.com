---
layout: post
title: "CentOS 6.7 部署 nodejs 5.3.0 环境"
date: 2016-01-08 18:11
categories: nodejs nodejs5.3.0 
tags:  nodejs node CentOS 
---

# 线上机器环境依赖 @2016-01-07

## 机器系统

CentOS 6.7

## 通过`yum`安装的依赖

* `yum install -y gcc*` ： 包含一堆GCC相关的东西，一开始OP就跑了这个，其实 *不一定* 有用。。。
* `yum install libpng-dev*` ： 前端处理图片的库依赖
* `yum install bzip2`
* `yum install git.x86_64` ： 使用 `git` 拉代码，执行编译脚本
* `yum install cronolog.x86_64` : 使用 `cronolog` 来切分日志

## 编译安装`gcc 4.8.5`

参考[这篇博客](https://teddysun.com/432.html)手动编译

*注意* :通过以上步骤编译安装 GCC 后，请 *慎用* yum update 或者通过 yum 来升级 GCC 的命令。

### 检查 gcc 版本

运行 `gcc -v` 看结果是否为 `4.8.5`

## 安装 nodejs 5.3.0 环境

在[官网](https://nodejs.org/en/)下载 *5.3.0* 版本对应编译好的二进制包,解压之后,拷贝到 `/opt/app/` 路径下.
完成之后,需要将 `/opt/app/node-v5.3.0-linux-x64/bin` 加到`PATH`环境变量中.

### 检测nodejs 是否安装成功

输入 `node -v` 或 `npm` 命令,可以正常执行

## 安装全局npm依赖包

* 安装[pm2](http://pm2.keymetrics.io/docs/usage/application-declaration/) : `npm install -g pm2`

## 需要OP提前在线上部署路径 /opt/app/node-ui 





                                            -------时2016年1月8日18:12竣工于帝都五道口清华科技大厦A座

