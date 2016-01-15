---
layout: post
title: "webpack gulp 处理多页面入口+图片路径问题"
date: 2016-01-15 17:18
categories: webpack gulp
tags:  webpack gulp 
---

# webpack gulp 处理多页面、图片路径问题

## webpack问题

之前在移动端上线基金活动页的时候，简单用过 `React` `webpack` 来开发，在webpack里能直接require node_modules里的模块，
还是非常方便的。但是，和之前一直使用的[FIS](fis)相比，感觉webpack还是有几点做的不是 *特别理想* ：

* webpack都是以 *JS* 文件做为入口，而实际开发中，有很多简单的页面，本身只是一个 *HTML* 文件，没有JS/CSS或者很少的JS/CSS直接内联到HTML文件中
* webpack中，在JS文件里可以直接 require 图片、CSS文件，但是最终图片（CSS）的发布路径，却不能很好的处理

上面两点，窃以为是很大的问题，我也一直没想明白，为啥老外用webpack用的那么high……可能真的像同事说的那样，他们真不知道还有[FIS](fis) 这种神一样的存在。

## gulp+webpack 

其实之前在 *厂里* 一直用的是[FIS](fis)，对开源的gulp、webpack接触少。最近准备上 [node前后端分离] ，是时候折腾下这些开源方案了。

上面第1个问题，可以通过gulp简单的搞定，简单页面嘛，直接用gulp拷贝到目标目录下就O了。
第2个问题，webpack里，图片的处理，是通过 `file-loader` 插件搞定的，看了这个插件文档，在输出图片时，是能够保留图片原始的 *path* 信息的！！

简单想了想，嗯，有搞头。

## 开发目录规范


### 项目下根目录

```
we_frontend
    ├── build (编译、MD5、合并之后的产出目录)
    ├── client（前端源代码目录）
    ├── gulp-task
    ├── gulpfile.js
    ├── isomorphic（前后端同构组件目录）
    ├── node-packages
    ├── node_modules
    ├── package.json
    ├── prebuild（编译过程的中间目录）
    ├── server（服务端代码）

```

### client 下的目录

```
client
├── mo
│   ├── components
│   │   └── common
│   │       ├── readme.md
│   │       └── wx
│   │           ├── wxShareDataConfig.js
│   │           └── wxsdk.js
│   ├── download
│   │   └── page
│   │       ├── app
│   │       │   ├── android.html
│   │       │   ├── disable.html
│   │       │   ├── download.html
│   │       │   └── img
│   │       │       ├── cl.jpg
│   │       │       ├── download.png
│   │       │       ├── logo.png
│   │       │       ├── monster.jpg
│   │       │       └── phone.png
│   │       └── app2
│   │           ├── assets
│   │           │   └── index-bg.png
│   │           └── index.html
│   ├── redux-todo
│   │   ├── page
│   │   │   ├── redux-todo.html
│   │   │   └── redux-todo.js
│   │   └── static
│   │       ├── index.css
│   │       └── monster.jpg
│   └── we-share
│       └── page
│           ├── we-share.html
│           └── we-share.js
└── pc
```

可以看到，`client` 目录下，是按照 *平台* 划分的大目录、 *mo* 表示 移动端 代码， *pc* 代表PC端代码。

在 *mo* 目录下，是按照 *模块* 划分的一级目录，比如有下载APP相关的页面就放在`download`模块下，分享相关的放在`we-share` 目录下。 上述结构里，有 `download`  `redux-todo` `we-share` 三个 *页面模块* ，另外一个 *components* 目录，先放一边。

### 编码约定

每个 *页面模块* 下，一般划分为 `page` `static` `widget` 三个目录：

* `page` 下面，放HTML及对应的 *入口JS* ，页面的 *入口JS* 必须放在 `page` 下面！！
* `static` 可以放CSS、字体、图片等
* `widget` 可以放 JS组件

Q1: 为什么 *页面入口JS* 必须放在 *page* 目录下

A1: 前面说过，webpack 处理JS，是找到入口JS来递归处理的，这里强制把入口JS放在 *page* 目录下，是方便我们在webpack里，只把页面的入口JS文件找到，交给webpack处理。

### 代码里引用资源的路径

有了上面的编码规范，在写代码的时候，应该怎么来引用对应的资源文件（CSS、图片）呢？又分为两种情况：

* 入口JS及入口JS所依赖的JS、CSS中：
    * 因为所有的入口JS，都会先经过webpack的处理，所以，在这些文件中，引用依赖的CSS、图片等，必须使用 *相对路径* ，即你要引用的资源，相对于你JS的位置。
    * 比如在上面的 `redux-todo/page/redux-todo.js` 中，要依赖 `redux-todo/static/index.css` 或 `redux-todo/static/monster.jpg` ，就可以写 `require('../static/index.css')` 或 `var imgURL = require('../static/monster.jpg')` 
* HTML文件及 *没有被入口JS依赖* 的CSS文件中：
    * HTML文件、 *没有被入口JS依赖* 的CSS文件，是直接经过 gulp 处理的，我们约定，在这类文件中引用资源， 必须使用以 *模块名* 起始的完整路径。
    * 比如，上面的 `redux-todo/page/redux-todo.html` 中，要依赖 `redux-todo/static/index.css` 或 `redux-todo/static/monster.jpg` ，就可以写 `redux-todo/static/index.css` 或 `redux-todo/static/monster.jpg` 


## 产出目录结构

最终的结果，是把 JS/图片 发布到 `/build/public/` 下面；HTML文件，发布到 `/build/view/` 下面。

你可能会说,HTML也是静态文件，为啥不发布到 `public` 下，其实是可以的，只是我们目前把HTML也作为后端模板来渲染，所以发布到 `view` 目录下，默认 `view` 目录下的文件，会通过action来 render。

## 处理流程

* gulp 拷贝 client 下的 图片、HTML，以及 *非入口JS* 到 `prebuild/public/` 下。
* webpack 处理 client 下的 入口JS，将合并之后的JS产出到 `prebuild/public/` 下， *[保留JS、CSS、图片 的原始路径](webpack-publicpath)* ，保留原始路径很重要，后面 `gulp-rev` `gulp-rev-replace` 是通过 路径信息 来替换的。注意： *webpack的配置里，publicPath设置为空字符串*！！！
* gulp 处理 `prebuild` 下的图片，压缩图片大小、加md5之后，产出到 `build/public/` 下，保留 *目录结构*，同时生成md5的map文件 img-map.json
* gulp 处理 `prebuild` 下的CSS，读取上面生成的图片map文件img-map.json，替换CSS中的图片路径，同时，对图片路径添加统一的 *publicPath* , 产出到 `build/public/` 下面。同时生成CSS的md5的map文件：css-map.json
* gulp 处理 `prebuild` 下的JS，读取上面的图片img-map.json，替换JS中的图片路径，添加统一的 *publicPath* ，产出到 `build/public/` 下面。
* `gulp-extend` 合并上面的 img-map.json css-map.json  js-map.json，产出完整的 all-map.json，保存到 `build/resource_maps` 下面。
* gulp 处理 `prebuild` 下的 HTML（当然也可以是后端模板） 文件，读取上述的 all-map.json，替换HTML中的JS/CSS/图片路径，统一添加 *publicPath* ，产出到 `build/view/` 目录下。

OK，至此，完成了从 `client` 目录，打包合并、替换URL并发布到 `build` 目录的事情。

Q1: 上面多次出现的 *publicPath* 是何方神圣？

A1: 这个是统一添加到资源最前面的URL，可以是CDN地址，可以是浏览器访问时，静态资源path最前面的统一部分。要说明一点，在 webpack 的配置中，一定不能设置 *publicPath* ，都交给 gulp 来添加！最后的demo里，默认 *publicPath* 是 `/n/static/` + *平台名*， 比如 移动端 就是  `/n/static/mo`，PC端就是 `/n/static/pc` 。


## 完整的配置

### webpack配置

webpack我是写的一个 `function` 来生成的，参数是 *平台名*，比如 *mo* , *pc* 。

```javascript

'use strict';


let path = require('path');
let glob = require('glob');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const BASE_DIR = path.dirname( __dirname );

/**
 * 获取client/page下所有的js入口文件
 * 计算相对webpack.config.js的相对路径  (value)
 * 获取js文件的basename (key)
 * 利用key和value返回entry数组
 */
function getPageEntry( platform ){
    let ext = '.js';
    //采用glob方案,而非正则,跨语言文件匹配的标准方案 : https://github.com/isaacs/node-glob
    let entryPattern = BASE_DIR + '/client/' + platform + '/**/*.js';
    let entrys = {};
    let entryFiles = glob.sync(entryPattern, {});
    entryFiles.forEach(function(file, index){
        //let basename = path.basename(file, ext);

        //将原始的JS入口路径,保留到webpack打包之后
        let basename = file.replace( BASE_DIR + '/client/' + platform + '/', '').replace( /\.js$/, '');

        //每个模块下的 page 目录下的所有JS,才是入口JS,别的都不是入口JS
        var arr = basename.split('/');
        // arr[0] 应该是 模块名
        if( arr[1] !== 'page' ){
            return;
        }

        let relativePath = path.relative(BASE_DIR, file);
        let fixRelativePath = './' + relativePath;
        entrys[basename] = fixRelativePath;
    });
    return entrys;
}


//根据 mo/pc 来返回不同的config
function getConfig( platform ){

    return {
        entry: getPageEntry( platform ),
        //vendors: [ 'console-polyfill', 'object-assign', 'es5-shim/es5-shim', 'es5-shim/es5-sham', './src/utils/mobileRem' ],
        //common : './src/css/common.less'
        output: {
            //定义js、css、image等url的前缀以及cdn, 非常重要
            publicPath: '',
            filename: '[name].pkg.js'
            //path : 产出路径在gulp中定义
        },
        module: {
            //webpack loader : http://webpack.github.io/docs/using-loaders.html
            loaders: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    loader : 'babel',
                    query : {
                        presets: ['es2015','react']
                    }
                },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract('style', 'css')
                },
                {
                    test: /\.less/,
                    loader: ExtractTextPlugin.extract('style', 'css!less')
                },
                {
                    test: /\.woff$/,
                    loader: 'url',
                    query : {
                        limit : 512
                    }
                },
                {
                    test: /\.(png|jpg|gif)$/,
                    loader: 'url',
                    query : {
                        limit : 512,
                        name : '[path][name].[ext]'
                    }
                }
            ]
        },
        resolve: {
            extensions: ['', '.js', '.jsx', '.woff', '.png', '.jpg', '.less', '.css']
        },
        plugins: [
            new webpack.NoErrorsPlugin(),
            new ExtractTextPlugin("[name].pkg.css", {
                allChunks: true
            })
        ]
    };

}

module.exports = getConfig;

```

### gulp 配置

gulp配置也是一个`function`，同样参数是 *平台名*，比如 *mo* , *pc*

```javascript
/**
 * Created by jess on 16/1/13.
 */


'use strict';

var gulp = require('gulp');
var gulpPlugin = require('gulp-load-plugins')();
var rev = require('gulp-rev');
var gutil = require('gulp-util');
var revReplace = require('gulp-rev-replace');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var del = require('del');
let pngquant = require('imagemin-pngquant');

const BUILD_DEST = require('./path-const.js');
var webpackGenerator = require('./webpack-generator.js');


// 根据 mo/pc 来生成task
function generateTask( platform ){

    //当前是否为 deploy ,deploy 下,会压缩图片/JS/CSS等
    var isDeploy = false;


    var basePath = BUILD_DEST.base;
    var prebuildPublic = BUILD_DEST.prebuild_public + '/' + platform;
    var prebuildView = BUILD_DEST.prebuild_view + '/' + platform;
    var buildPublic = BUILD_DEST.build_public + '/' + platform;
    var buildView = BUILD_DEST.build_view + '/' + platform;
    var serverPublic = BUILD_DEST.server_public + '/' + platform;
    var serverView = BUILD_DEST.server_view + '/' + platform;

    var srcPath = basePath + '/client/' + platform;
    var isomorphicPath = BUILD_DEST.isomorphic_path;
    var mapPath = basePath + '/build/resource_maps/' + platform;

    var mobileManifestName = platform +  '-rev-manifest.json';
    var imgManifest = mapPath + '/img/' + mobileManifestName;
    var cssManifest = mapPath + '/css/' + mobileManifestName;

    var publicPath = '/n/static/' + platform + '/';

    var webpackConfig = webpackGenerator( platform );


    var cleanStep = platform + ':clean';
    var step1 = platform + ':copy2prebuild';
    var step2 = platform + ':webpack';
    var step3 = platform + ':rev-img';
    var step4 = platform + ':rev-css';
    var step5 = platform + ':rev-js';
    var step6 = platform + ':merge-map';
    var step7 = platform + ':html';

    var devTask = platform + ':dev';
    var deployTask = platform + ':deploy';


    //deploy 前,要清空原有的
    gulp.task( cleanStep, function(){
        let buildGlob = BUILD_DEST.build + '/*';
        let prebuildGlob = BUILD_DEST.prebuild + '/*';

        return del.sync([buildGlob, prebuildGlob]);
    } );

//step 1 使用gulp拷贝 HTML/CSS 等资源到 prebuild 目录
    gulp.task(step1, function(){

        //不拷贝
        gulp.src( [ srcPath + '/**/*.{jpg,png,gif,jpeg,css,js}', '!' + srcPath + '/components/**/*.js', '!' + srcPath + '/**/page/*.js' ] )
            .pipe( gulp.dest( prebuildPublic ) );

        //html 文件拷贝到不同目录
        return gulp.src( srcPath + '/**/*.{html,tpl}' )
            .pipe( gulp.dest( prebuildView ) );
    } );

//step 2 webpack处理各个页面的入口JS和JS依赖的 图片/CSS 等资源,输出到 prebuild 目录
    gulp.task(step2, [ step1], function(){

        return gulp.src('./client/mo/**/*.js')
            .pipe(webpackStream(webpackConfig, webpack))
            .pipe(gulp.dest( prebuildPublic ));
    } );

//step 3 处理图片的 md5,保留 map
    gulp.task(step3, [ step2 ], function(){

        return gulp.src( [  prebuildPublic + '/**/*.{jpg,jpeg,png,gif}' ] )
            .pipe( gulpPlugin.imagemin({
                progressive: true,
                use: [pngquant({quality: '70-80'})]
            }) )
            .pipe( rev() )
            .pipe( gulp.dest( buildPublic ) )
            .pipe( rev.manifest( mobileManifestName ) )
            .pipe( gulp.dest( mapPath + '/img'));

    } );

//step 4 处理 CSS md5
    gulp.task( step4, [ step3 ], function(){

        var manifest = gulp.src( imgManifest );

        return gulp.src( [  prebuildPublic + '/**/*.css' ] )
            .pipe( revReplace( {
                manifest : manifest,
                prefix : publicPath
            }) )
            .pipe( rev() )
            .pipe( gulp.dest( buildPublic ) )
            .pipe( rev.manifest( mobileManifestName ) )
            .pipe( gulp.dest( mapPath + '/css'));

    } );

// step 5  js md5
    gulp.task( step5, [ step4 ], function(){

        var manifest = gulp.src( imgManifest );

        return gulp.src( [ prebuildPublic + '/**/*.js' ] )
            .pipe( revReplace( {
                manifest : manifest,
                prefix : publicPath
            }) )
            .pipe( rev() )
            .pipe( gulp.dest( buildPublic ) )
            .pipe( rev.manifest( mobileManifestName ) )
            .pipe( gulp.dest( mapPath + '/js'));

    } );

//step 6 merge map
    gulp.task( step6 , [ step5 ], function(){
        let mapGlob = mapPath + '/**/*.json';
        let finalResourceMap = mobileManifestName;
        return gulp.src(mapGlob)
            .pipe(gulpPlugin.extend(finalResourceMap))
            .pipe(gulp.dest( mapPath ));
    } );

//step 7 替换HTML中的各个资源路径
    gulp.task( step7 , [ step6 ], function(){

        var manifest = gulp.src( mapPath + '/' + mobileManifestName );

        return gulp.src( [ prebuildView + '/**/*.{html,tpl}'] )
            .pipe( revReplace( {
                manifest : manifest,
                prefix : publicPath
            }) )
            .pipe( gulp.dest( buildView ) );

    } );


    //注册 dev 任务,监听文件变化,自动编译
    gulp.task( devTask, [ step7 ], function(){

        let clientGlob = [ srcPath + '/**/**', isomorphicPath + '/**/**' ];
        gulp.watch(clientGlob, [ step7 ]);

    } );

    // deploy 任务
    gulp.task( deployTask, [ cleanStep, step7  ], function(){

        //压缩JS保存到server下
        // 捕获 uglify 错误  https://github.com/terinjokes/gulp-uglify/issues/50
        gulp.src( buildPublic + '/**/*.js').pipe( gulpPlugin.uglify() ).on('error', gutil.log ).pipe( gulp.dest( serverPublic) );
        //压缩CSS -> server
        gulp.src( buildPublic + '/**/*.css').pipe( gulpPlugin.minifyCss() ).pipe( gulp.dest( serverPublic) );
        //picture -> server
        gulp.src( buildPublic + '/**/*.{jpg,png,gif,jpeg}').pipe( gulp.dest( serverPublic) );

        //拷贝 view 目录下内容,到 server/view
        return gulp.src( buildView + '/**/*.{html,tpl}').pipe( gulp.dest( serverView ) );
    } );

}


module.exports = generateTask;

```

## 最终产出的 build 结构

```
build
├── public
│   └── mo
│       ├── client
│       │   └── mo
│       │       └── redux-todo
│       │           └── static
│       │               └── monster-784228d04d.jpg
│       ├── download
│       │   └── page
│       │       ├── app
│       │       │   └── img
│       │       │       ├── cl-6ee4efbe31.jpg
│       │       │       ├── download-68ce9abf41.png
│       │       │       ├── logo-8688ecdb05.png
│       │       │       ├── monster-784228d04d.jpg
│       │       │       └── phone-b1c0190ff3.png
│       │       └── app2
│       │           └── assets
│       │               └── index-bg-7c73feb41c.png
│       ├── isomorphic
│       │   └── components
│       │       └── todo
│       │           └── react-ui
│       │               ├── TodoHeader
│       │               │   └── assets
│       │               │       └── todoLogo-1a7598018f.png
│       │               └── TodoItem
│       │                   └── assets
│       │                       └── todoItem-bg-ca35e58dd0.jpg
│       ├── redux-todo
│       │   ├── page
│       │   │   ├── redux-todo-35aff0e738.pkg.js
│       │   │   └── redux-todo-7516570db4.pkg.css
│       │   └── static
│       │       ├── index-eaecb6e388.css
│       │       └── monster-784228d04d.jpg
│       └── we-share
│           └── page
│               └── we-share-376c8855e0.pkg.js
├── resource_maps
│   └── mo
│       ├── css
│       │   └── mo-rev-manifest.json
│       ├── img
│       │   └── mo-rev-manifest.json
│       ├── js
│       │   └── mo-rev-manifest.json
│       └── mo-rev-manifest.json
└── views
    └── mo
        ├── download
        │   └── page
        │       ├── app
        │       │   ├── android.html
        │       │   ├── disable.html
        │       │   └── download.html
        │       └── app2
        │           └── index.html
        ├── redux-todo
        │   └── page
        │       └── redux-todo.html
        └── we-share
            └── page
                └── we-share.html
```


[fis]: http://fis.baidu.com/
[webpack-publicpath]: https://github.com/webpack/webpack/issues/1189



                                            -------时2016年1月15日19:27竣工于帝都五道口清华科技大厦A座

