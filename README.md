## fly-Pagination
🚀🚀🚀 fly-Pagination是一款分页器插件，`后续`会支持通用样式定制，可扩展，及简化的插件风格.

## feature
正如其名，"轻",压缩后只有`5kb`，可扩展性高，后期会通过cli定制样式配置(后期会支持配置主题色)，并且
内置参数类型验证，保证了健壮性。

## download
<a href="http://39.107.66.37:8090/assets/pagination.1.0.0.min.js" download> 点击下载 </a>
下面,让我们开始使用漂亮的分页器吧！😄

##use

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


## options

<br /><br /><br />

| 参数      | 说明                                      | 类型         | 默认值 |
|----------|------------------------------------------|-------------|-------|
| containerElement | 页码容器，默认插入到 | Object(HTMLDom) | class(.pagination) |
| pageSize | 每页展示多少条 | Number | 10 |
| pageNum |  当前的页数 | Number | 1 |
| total | 总条数 | Number | 0 |
| showListPages | 显示的页码块 | Number | 5 |
| skipPageNum |  快速翻页每次的页数 | Number | 5 |
| onChange |  页码发生变化时的触发函数 | Function | - |
| onTest |  页码发生变化前的钩子函数 | Function | -|
