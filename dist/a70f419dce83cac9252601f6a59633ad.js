// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({5:[function(require,module,exports) {
"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//分页器
(function (w, d) {

  var Pagination;

  w.Pagination = Pagination = function Pagination(options) {
    var _this2 = this;

    if (Object.prototype.toString.call(options) !== "[object Object]") {
      console.error("options type must be Object");return;
    }

    function foo() {};

    //配置参数
    this._containerElement = document.querySelector('.pagination'); //页码容器
    this._pageSize = 10; //一页展示多少
    this._pageNum = 1; //当前页数(默认为1)
    this._total = 0; //总条数
    this._showListPages = 5; //列表中最少展示几个数字标签页码.
    this._skipPageNum = 5; //快速翻页时，每次翻多少.
    this._mode = 'ends'; //模式，使用文字上一页下一页或者按钮

    this._onChange = foo;
    this._onTest = foo; //改变页数时用于外部验证.

    var __CONFIG_OPTIONS__ = ["containerElement", "pageSize", "pageNum", "total", "showListPages", "onChange", "onTest", "skipPageNum", "mode"];

    //绑定类型验证
    this.bindOptionTypes(__CONFIG_OPTIONS__);

    //生成容器
    this.ul_list = addClass(document.createElement('UL'), 'fly-pagination-list');
    this.div_container = addClass(document.createElement('DIV'), "fly-pagination-wrap");
    this.div_container.appendChild(this.ul_list);
    this.__pagesNum = Math.ceil(this._total / this._pageSize); //根据total应显示多少页数.

    // 更新选项
    this.updateOption(options);

    var skipPageClick = function skipPageClick(pageNum) {
      this.updatePageNum(pageNum);
    };

    var _calcFlanksPageNumber = this.calcFlanksPageNumbers(),
        _calcFlanksPageNumber2 = _slicedToArray(_calcFlanksPageNumber, 2),
        left = _calcFlanksPageNumber2[0],
        right = _calcFlanksPageNumber2[1];

    //初始更新pages列表


    this.updateViewPageList(left, right);

    //不可更改内置方法.
    var innerFunction = ["updateOption", "bianOptionTypes", "initTagElement", "calcFlanksPageNumbers", "updatePageNum", "skipPageNum"];

    innerFunction.forEach(function (funcName) {
      Object.defineProperty(Object.getPrototypeOf(_this2), funcName, {
        writeable: false,
        configurable: false,
        enmerable: false
      });
    });

    //返回外部接口
    return function (options) {
      _this2.updateOption(options);

      var _calcFlanksPageNumber3 = _this2.calcFlanksPageNumbers(),
          _calcFlanksPageNumber4 = _slicedToArray(_calcFlanksPageNumber3, 2),
          left = _calcFlanksPageNumber4[0],
          right = _calcFlanksPageNumber4[1];

      _this2.updateViewPageList(left, right);
    };
  };

  /**
   *  注册设置参数的 options 函数.
   *  @param1 {object} 参数列表
   *  @param2 {function} 回调 @param1 err  @param2 options
   *  @return null.
   *
   *  note :  持续更新类中的状态
   */
  Pagination.prototype.updateOption = function (options) {
    for (var key in options) {
      if (this.hasOwnProperty(key)) this[key] = options[key];
    };
  };

  /**
   * @param {Object} 需要绑定的options
   * @return Boolean
   * 
   * note : 负责验证options类型 , 绑定 set属性存取器 属性验证
   */
  Pagination.prototype.bindOptionTypes = function (OPTIONS) {

    var _this = this;

    var OPTIONS_TYPES = {
      containerElement: function containerElement(value) {
        //如果是对象必须是dom元素
        //如果是选择器(限制 id | class)，在当前页面中必须是必须是唯一的.
        _this["_containerElement"] = value;
      },
      pageSize: function pageSize(value) {
        // testParamTypes(Number,value,"fly-pagination pageSize is not safa valu, will be use default pageSize 10",()=>{
        //      _this["_pageSize"] = value; 
        // });
        _this["_pageSize"] = value;
      },
      pageNum: function pageNum(value) {
        _this["_pageNum"] = value;
      },
      total: function total(value) {
        _this["_total"] = value;
      },
      onChange: function onChange(value) {
        _this["_onChange"] = value;
      },
      onTest: function onTest(value) {
        _this["_onTest"] = value;
      },
      skipPageNum: function skipPageNum(value) {
        _this["_skipPageNum"] = value;
      },
      showListPages: function showListPages(value) {
        _this["_showListPages"] = value;
      },
      mode: function mode(value) {
        _this['_mode'] = value;
      }
    };

    for (var i = 0; i < OPTIONS.length; i++) {
      Object.defineProperty(this, OPTIONS[i], {
        set: OPTIONS_TYPES[OPTIONS[i]]
      });
    }
  };

  /**
   * 初始化固定标签 上一页，下一页，输入框.
   */
  Pagination.prototype.initTagElement = function () {
    var _this3 = this;

    var skipPageNum = this._skipPageNum;
    var pagesNum = Math.ceil(this._total / this._pageSize);
    var topElement = this.initElement(this.makeLiElement(this._mode === 'text' ? "上一页" : 1), 'number');
    var nextElement = this.initElement(this.makeLiElement(this._mode === 'text' ? "下一页" : pagesNum), 'number');
    var superTopElement = this.initElement(this.makeLiElement(''), "fly-super-up");
    var superNextElement = this.initElement(this.makeLiElement(''), "fly-super-down");

    topElement.__TYPE__ = 'topElement';
    nextElement.__TYPE__ = 'nextElement';
    superTopElement.__TYPE__ = 'superTopElement';
    superNextElement.__TYPE__ = 'superNextElement';

    if (this._mode === 'ends') {
      topElement.KEY = 1;
      nextElement.KEY = Math.ceil(this._total / this._pageSize);
    }

    topElement.addEventListener('click', function () {
      if (_this3._mode === 'ends') {
        _this3.updatePageNum(1);
        return;
      }
      _this3.updatePageNum(_this3._pageNum - 1);
    });

    nextElement.addEventListener('click', function () {
      if (_this3._mode === 'ends') {
        _this3.updatePageNum(pagesNum);
      }
      _this3.updatePageNum(_this3._pageNum + 1);
    });

    superTopElement.addEventListener('click', function () {
      _this3.updatePageNum(_this3._pageNum - skipPageNum);
    });

    superNextElement.addEventListener('click', function () {
      _this3.updatePageNum(_this3._pageNum + skipPageNum);
    });

    return {
      topElement: topElement,
      nextElement: nextElement,
      superTopElement: superTopElement,
      superNextElement: superNextElement
    };
  };

  /**
   * 初始化dom元素，添加其类名.
   *
   * @param ele {HTML_DOM} 需要进行初始化的 Element
   * @param {string} 不同type不同初始规则.
   * @returns {HTML_DOM} 经过初始化之后的 Dom 元素.
   */
  Pagination.prototype.initElement = function (ele, type) {
    var CLASSNAMES = ["fly-page-item"];
    if (type === "number") {
      CLASSNAMES.push("fly-page-number");
    } else if (type === "top") {
      CLASSNAMES.push("fly-page-top");
    } else if (type === "next") {
      CLASSNAMES.push("fly-page-next");
    } else {
      CLASSNAMES.push(type);
    }
    ele.className = ele.className + CLASSNAMES.join(" ").trim();
    return ele;
  };

  /**
   * 用于更新pageNum 即展示的页数(过程性方法).
   * @param pageNum {Number} 需要更新到的页数.
   * @return {undefined}
   */
  Pagination.prototype.updatePageNum = function (pageNum) {
    var _this4 = this;

    var test = true,
        len = void 0,
        leftBoundary = void 0,
        rightBoundary = void 0;

    var maxPagesNumber = Math.ceil(this._total / this._pageSize);

    if (this._onTest) {
      test = !(this._onTest(pageNum, this._pageSize) === false);
    };

    var conditions = [typeof pageNum === "number", //传入参数必须为number
    test, //外部验证必须通过.
    pageNum !== this._pageNum //重复点击标签不触发
    ];

    len = conditions.length;

    while (len--) {
      if (!conditions[len]) {
        return;
      }
    };

    if (pageNum < 1) {
      pageNum = 1;
    };

    if (pageNum > maxPagesNumber) {
      pageNum = maxPagesNumber;
    };

    this._pageNum = pageNum;

    this._onChange(this._pageNum, this._pageSize);

    var _calcFlanksPageNumber5 = this.calcFlanksPageNumbers();

    var _calcFlanksPageNumber6 = _slicedToArray(_calcFlanksPageNumber5, 2);

    leftBoundary = _calcFlanksPageNumber6[0];
    rightBoundary = _calcFlanksPageNumber6[1];


    var isHideTopPage = this._pageNum < this._skipPageNum;
    var isHideNextPage = this._pageNum > maxPagesNumber - 3;

    this.updateViewPageList(leftBoundary, rightBoundary, function (item) {
      if (_this4._mode === 'ends') {
        if (item.__TYPE__ === 'superTopElement' && isHideTopPage || item.__TYPE__ === 'superNextElement' && isHideNextPage) {
          return false;
        }
      }
      return true;
    });
  };

  /**
   * 根据动态值showListPages 计算左右两侧页码.
   * 
   * @param showListAveragePages {number} 平均两边放多少个页码.
   * @return [leftBoundary,rightBoundary] 分别是计算出来的两侧页码数
   * */
  Pagination.prototype.calcFlanksPageNumbers = function () {

    var showListPages = this._showListPages; //页码list列表可以展示几个页码标签.
    var showListAveragePages = Math.ceil((showListPages - 1) / 2); //奇数情况，两边分别为偶数
    var maxPages = Math.ceil(this._total / this._pageSize); //根据total应显示多少页数.
    var pageNum = this._pageNum;

    var left = 1,
        right = showListPages; //默认值为从第一个，到showListPages长度(除自己)
    var t = true;

    if (pageNum - showListAveragePages <= 0) {
      t = false;
    } else if (pageNum + showListAveragePages > maxPages) {
      left = Math.max(maxPages - showListPages + 1, 1);right = maxPages;
      t = false;
    }

    if (t) {
      right = pageNum + showListAveragePages;
      left = pageNum - showListAveragePages;
    }

    //只有在偶数的情况下才会出现大于 ， viewPagesList 显示,重新计算
    if (right - (left - 1) > showListPages) {
      var avergae = showListPages / 2;
      left = Math.max(pageNum - avergae, 1);
      right = pageNum + avergae - 1;
    }

    //右侧值大于真实页数时,取最小
    return [left, Math.min(right, maxPages)];
  };

  /**
   *  更新显示的list，只负责渲染，不负责逻辑(过程性方法).
   *
   *  @param start {Number}  从哪个页码开始.
   *  @param end {Number} 到哪个页码结束.
   *  @return {undefined}
   */
  Pagination.prototype.updateViewPageList = function () {
    var start = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    var end = arguments[1];
    var isAdd = arguments[2];


    end = end || this._showListPages;

    var domFragment = document.createDocumentFragment();

    var pageContainer = this._containerElement,
        ul = this.ul_list,
        container = this.div_container;

    var bodyPagesNumbers = this.createBodyNumberPages(start, end);

    var _initTagElement = this.initTagElement(),
        topElement = _initTagElement.topElement,
        nextElement = _initTagElement.nextElement,
        superTopElement = _initTagElement.superTopElement,
        superNextElement = _initTagElement.superNextElement;

    while (ul.firstChild) {
      ul.removeChild(ul.firstChild);
    }

    var queueEle = [topElement, superTopElement].concat(_toConsumableArray(bodyPagesNumbers), [superNextElement, nextElement]);

    for (var i = 0; i < queueEle.length; i++) {
      var item = queueEle[i];
      if (isAdd && isAdd(item) || isAdd == null) {
        if (item.KEY && item.KEY === this._pageNum) {
          addClass(item, "active");
        }
        domFragment.appendChild(item);
      }
    }

    ul.appendChild(domFragment);
    container.appendChild(ul);
    pageContainer.appendChild(container);
  };

  /**
   * 用于渲染中间数字性页码.
   * 
   * @param start 开始的页数.
   * @param needTotal 结束的页数.
   * @return {Array} DOM数组
   */
  Pagination.prototype.createBodyNumberPages = function (start, needTotal) {
    var _this5 = this;

    var HTMLDom = [];

    if (this._mode === 'ends') {
      if (needTotal + 1 <= Math.ceil(this._total / this._pageSize)) {
        needTotal += 1;
      } else {}
    }

    var _loop = function _loop(i) {

      if (_this5._mode === 'ends' && (i === 1 || i === needTotal)) return "continue";

      var ele = _this5.makeLiElement(i);

      _this5.initElement(ele, "number");

      ele.KEY = i;

      Object.defineProperty(ele, "KEY", {
        configurable: false,
        writable: false,
        enumerable: false
      });

      ele.addEventListener('click', function () {
        _this5.updatePageNum(i);
      });

      HTMLDom.push(ele);
    };

    for (var i = start; i <= needTotal; i++) {
      var _ret = _loop(i);

      if (_ret === "continue") continue;
    };

    return HTMLDom;
  };

  /**
   * 创建 <li> <a><a/> </li>
   * @return Element
   */
  Pagination.prototype.makeLiElement = function (innerHTML) {
    var li = d.createElement('LI');
    var a = d.createElement('A');
    a.innerHTML = innerHTML;
    li.setAttribute('title', innerHTML);
    li.appendChild(a);
    return li;
  };

  //classlist
  function classList(element) {
    return element && " " + element.className + " ";
  }

  //hasClass
  function hasClass(element, cls) {

    var className = classList(element);

    return className.indexOf(cls) >= 0;
  }

  //add class
  function addClass(element, cls) {
    var oldList = classList(element),
        newList = oldList + cls;
    if (hasClass(element, cls)) return;
    element.className = newList.trim();
    return element;
  }

  //remove class
  function removeClass(element, cls) {

    var comCls = typeof element === "string" ? element : classList(element),
        newList;

    if (!hasClass(element, cls)) return;

    newList = comCls.replace(" " + cls + " ", " ");

    element.className = newList.trim();
  }
})(window, document);
},{}],0:[function(require,module,exports) {
var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent && typeof WebSocket !== 'undefined') {
  var ws = new WebSocket('ws://' + window.location.hostname + ':51928/');
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        window.location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id)
  });
}
},{}]},{},[0,5])