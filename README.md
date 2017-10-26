## fly-Pagination
🚀🚀🚀 fly-Pagination是一个依赖于jquery的分页器插件，`后续`会支持通用样式定制，可扩展，及简化的插件风格.

## feature
正如其名，"轻",可扩展性高,定制样式配置(后期会支持配置主题色)。

## use
**此插件依赖于juqery,如果项目没有使用jQuery,后续会有原生版本，使用前请先加载jQuery.**

使用 `new Fly_Pagination`进行初始化并填入你想要使用的[Option]，通常这是第一次页面渲染进行的。

```
 const update = new Pagination({
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
const update = new Pagination({...someCode});

update({
    total:401,
    pageSize:5,
    pageNum:1,
});

```
每次`update`，只会对填入的选项(Options)进行替换操作，因此，之前的参数并不会消失。
