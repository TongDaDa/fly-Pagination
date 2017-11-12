## fly-Pagination
🚀🚀🚀 fly-Pagination是一个依赖于jquery的分页器插件，`后续`会支持通用样式定制，可扩展，及简化的插件风格.

[![NPM version][npm-badge]][npm-url]
[![Build Status][travis-badge]][travis-url]
[![Coverage Status][coveralls-badge]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]
[![NPM downloads][npm-downloads]][npm-url]

[npm-badge]: https://img.shields.io/npm/v/pinyin.svg?style=flat
[npm-url]: https://www.npmjs.com/package/pinyin
[npm-downloads]: http://img.shields.io/npm/dm/pinyin.svg?style=flat
[travis-badge]: https://travis-ci.org/hotoo/pinyin.svg?branch=master
[travis-url]: https://travis-ci.org/hotoo/pinyin
[coveralls-badge]: https://coveralls.io/repos/hotoo/pinyin/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/hotoo/pinyin
[gittip-image]: https://img.shields.io/gittip/hotoo.svg?style=flat-square
[gittip-url]: https://www.gittip.com/hotoo/

## feature
正如其名，"轻",可扩展性高,定制样式配置(后期会支持配置主题色)，内置参数类型验证。

## download

1.使用npma安装到您的项目下.

```
npm install --save fly-pagination
```

2.如果您的开发模式或种种原因不能使用npm下载，也可从[![NPM downloads][npm-downloads]][npm-url]下载zip压缩包格式文件.
解压zip之后，请把 `.js` `.css` 文件添加到您的项目中，在这之前请确定您已经引入了jQuery。这将会在您的页面中生成一个全局属性
`Fly_Pagination`。

下面,让我们开始使用漂亮的分页器吧！😄

## use

**此插件依赖于juqery,如果项目没有使用jQuery,使用前请先加载jQuery.**

使用 `new Fly_Pagination`进行初始化并填入你想要使用的Options，通常这是第一次页面渲染进行的。

```
 var update = new Pagination({
      total:501,  //总条数501
      pageNum:1,  //当前激活的页数
      pageSize:10,  //每页展示多少条
      onChange:(pageNum,pageSize)=>{  //每次页码改变时触发
          console.log(pageNum);
          console.log(pageSize);
      }
  });
```
它返回一个update函数，此函数用于更新内部参数。在一些动态刷新下，并不需要重新`new Pagination`，使用此函数来更新.

```
var update = new Pagination({...someCode});

update({
    total:401,
    pageSize:5,
    pageNum:1,
});

```

注意：**每次`update`，只会对填入的选项(Options)进行替换操作，因此，之前的参数并不会消失。**


##Options

containerElement
说明:页码容器，默认插入到
参数:{String | HTMLElement}
默认值:

pageSize
说明:每页展示多少条
参数:{Numbe}
默认值:10

pageNum
说明:当前的页数
参数:{Number}
默认值:1

total
说明:总条数
参数:{Number}
默认值:0

showListPages
说明:显示的页码块
参数:{Number}
默认值:5

skipPageNum
说明: 快速翻页每次的页数.
参数: {Number}
默认值: 5


onChange
说明: 页码发生变化时的触发函数，
参数 : {Function} (pageSize,pageNum)
默认值: 无

onTest
说明: 页码发生变化前的钩子函数.
参数: {Function}(pageNum,pageSize)
默认值: 无