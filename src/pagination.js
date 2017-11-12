//分页器
(function(w,d){
    
        var Pagination;
        
        w.Pagination = Pagination = function(options){
    
            if(Object.prototype.toString.call(options) !== "[object Object]"){ console.error("options type must be Object"); return; }
    
            function foo(){};
    
            //配置参数
            this._containerElement = $(".pagination"), //页码容器
            this._pageSize = 10; //一页展示多少
            this._pageNum = 1;  //当前页数(默认为1)
            this._total = 0; //总条数
            this._showListPages = 5; //列表中最少展示几个数字标签页码.
            this._skipPageNum = 5; //快速翻页时，每次翻多少.

            this._onChange = foo;
            this._onTest = foo;  //改变页数时用于外部验证.

            const __CONFIG_OPTIONS__ = ["containerElement","pageSize","pageNum",
            "total","showListPages","onChange","onTest","skipPageNum"];

            //绑定类型验证
            this.bindOptionTypes(__CONFIG_OPTIONS__);

            //生成容器
            this.ul_list = $(document.createElement("UL")).addClass("fly-pagination-list");
            this.div_container = $(document.createElement("DIV")).addClass("fly-pagination-wrap").append(this.ul_list);

            // 更新选项
            this.updateOption(options);
    
            const skipPageClick = function(pageNum){ this.updatePageNum(pageNum); };
    
            const [left,right] = this.calcFlanksPageNumbers();
    
            //初始更新pages列表
            this.updateViewPageList(left,right);
    
            //不可更改内置方法.
            const innerFunction = ["updateOption","bianOptionTypes",
            "initTagElement","calcFlanksPageNumbers","updatePageNum","skipPageNum"];
    
            innerFunction.forEach((funcName)=>{
                Object.defineProperty(Object.getPrototypeOf(this),funcName,{
                    writeable:false,
                    configurable:false,
                    enmerable:false,
                })
            });

            //返回外部接口
            return (options)=>{

                this.updateOption(options);

                const [left,right] = this.calcFlanksPageNumbers();
                
                this.updateViewPageList(left,right);

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
        Pagination.prototype.updateOption = function(options){
            for(let key in options){
               if(this.hasOwnProperty(key)) this[key] = options[key]
            };
        };
    
        /**
         * @param {Object} 需要绑定的options
         * @return Boolean
         * 
         * note : 负责验证options类型 , 绑定 set属性存取器 属性验证
         */
        Pagination.prototype.bindOptionTypes = function(OPTIONS){

            const _this = this;

            const OPTIONS_TYPES = {
                containerElement(value){
                    //如果是对象必须是dom元素
                    //如果是选择器(限制 id | class)，在当前页面中必须是必须是唯一的.
                    _this["_containerElement"] = value;
                },
                pageSize(value){
                    // testParamTypes(Number,value,"fly-pagination pageSize is not safa valu, will be use default pageSize 10",()=>{
                    //      _this["_pageSize"] = value; 
                    // });
                    _this["_pageSize"] = value;
                },
                pageNum(value){
                    _this["_pageNum"] = value;
                },
                total(value){
                    _this["_total"] = value;
                },
                onChange(value){
                    _this["_onChange"] = value;
                },
                onTest(value){
                    _this["_onTest"] = value;
                },
                skipPageNum(value){
                    _this["_skipPageNum"] = value;
                },
                showListPages(value){
                    _this["_showListPages"] = value;
                }
            };
    
            for(let i=0; i<OPTIONS.length; i++){
                Object.defineProperty(this,OPTIONS[i],{
                    set:OPTIONS_TYPES[OPTIONS[i]]
                });
            }
        };
    
        /**
         * 初始化固定标签 上一页，下一页，输入框.
         */
        Pagination.prototype.initTagElement = function(){
    
            const skipPageNum = this._skipPageNum; //每次点击省略号跳10页

            const topElement = $(this.initElement(d.createElement("LI"),"top"));
            const nextElement = $(this.initElement(d.createElement("LI"),"next"));
            const superTopElement = $(this.initElement(d.createElement("LI"),"fly-super-up"));
            const superNextElement = $(this.initElement(d.createElement("LI"),"fly-super-down"));
    
            topElement.html("上一页").attr("title","上一页");
            nextElement.html("下一页").attr("ttile","下一页");
    
            topElement.click(()=>{
                    this.updatePageNum(this._pageNum-1);
            });
    
            nextElement.click(()=>{
                    this.updatePageNum(this._pageNum+1);
            });
    
            superTopElement.click(()=>{
                    this.updatePageNum(this._pageNum-skipPageNum);
            });
    
            superNextElement.click(()=>{
                    this.updatePageNum(this._pageNum+skipPageNum);
            });
    
            return {
                topElement,
                nextElement,
                superTopElement,
                superNextElement,
            };
        };
    
        /**
         * 初始化dom元素，添加其类名.
         *
         * @param ele {HTML_DOM} 需要进行初始化的 Element
         * @param {string} 不同type不同初始规则.
         * @returns {HTML_DOM} 经过初始化之后的 Dom 元素.
         */
        Pagination.prototype.initElement = function(ele,type){
    
            let CLASSNAMES = ["fly-page-item"];
    
            if(type === "number"){
                CLASSNAMES.push("fly-page-number");
            }else if(type === "top"){
                CLASSNAMES.push("fly-page-top");
            }else if(type === "next"){
                CLASSNAMES.push("fly-page-next");
            }else{
                CLASSNAMES.push(type);
            }
    
            ele.className = CLASSNAMES.join(" ").trim();
    
            return ele;
        };
    
        /**
         * 用于更新pageNum 即展示的页数(过程性方法).
         * 
         * @param pageNum {Number} 需要更新到的页数.
         * @return {undefined}
         */
        Pagination.prototype.updatePageNum = function(pageNum){
    
            let test = true,
                len,
                leftBoundary,
                rightBoundary;
    
            const maxPagesNumer = Math.ceil(this._total / this._pageSize);;
    
            if(this._onTest){ test = !(this._onTest(pageNum,this._pageSize) === false); };
    
            const conditions = [
                typeof pageNum === "number", //传入参数必须为number
                test,                        //外部验证必须通过.
                pageNum !== this._pageNum    //重复点击标签不触发
            ];
    
            len = conditions.length;
    
            while(len--){ if(!conditions[len]){ return; } };
    
            if(pageNum<1){ pageNum = 1; };
    
            if(pageNum > maxPagesNumer){ pageNum = maxPagesNumer; };
    
            this._pageNum = pageNum;
    
            this._onChange(this._pageNum,this._pageSize);

            [leftBoundary,rightBoundary] = this.calcFlanksPageNumbers();
    
            this.updateViewPageList(leftBoundary,rightBoundary);
    
        };
    
        /**
         * 根据动态值showListPages 计算左右两侧页码.
         * 
         * @param showListAveragePages {number} 平均两边放多少个页码.
         * @return [leftBoundary,rightBoundary] 分别是计算出来的两侧页码数
         * */
        Pagination.prototype.calcFlanksPageNumbers = function(){
    
            const showListPages = this._showListPages; //页码list列表可以展示几个页码标签.

            const showListAveragePages = Math.ceil((showListPages-1) / 2);  //奇数情况，两边分别为偶数

            const maxPages = Math.ceil(this._total / this._pageSize);; //根据total应显示多少页数.
    
            const pageNum = this._pageNum;
    
            let left = 1 ,right = showListPages; //默认值为从第一个，到showListPages长度(除自己)

            let t = true;
    
            if(pageNum - showListAveragePages <= 0){

               t= false;

            }else if((pageNum + showListAveragePages) > maxPages){

                left = Math.max(maxPages - showListPages+1,1); right = maxPages;

                t = false;

            };
    
            if(t){
    
                    right = pageNum + showListAveragePages;

                    left = pageNum - showListAveragePages;
    
            };

           
            //只有在偶数的情况下才会出现大于 ， viewPagesList 显示,重新计算
            if((right - (left-1)) > showListPages){

                const avergae = showListPages / 2;

                left = Math.max((pageNum - avergae ),1); 

                right = pageNum + avergae-1;

            }

            //右侧值大于真实页数时,取最小
            return [left,Math.min(right,maxPages)]
    
        };
    
        /**
         *  更新显示的list，只负责渲染，不负责逻辑(过程性方法).
         *
         *  @param start {Number}  从哪个页码开始.
         *  @param end {Number} 到哪个页码结束.
         *  @return {undefined}
         */
        Pagination.prototype.updateViewPageList = function(start = 1,end){
 
            end = end || this._showListPages;

            const domFragment = document.createDocumentFragment();
       
            const pageContainer = this._containerElement,
                  ul = this.ul_list,
                  container = this.div_container;

            const bpdyPagesNumbers = this.createBodyNumberPages(start,end);
    
            const {topElement,nextElement,superTopElement,superNextElement} = this.initTagElement();
    
            ul.empty();
    
            ul.append(topElement);
            ul.append(superTopElement);
    
            bpdyPagesNumbers.forEach((ele,k)=>{
                if(ele[0].KEY === this._pageNum){
                    ele.addClass("active");
                };
                ul.append(ele);
            });
    
            ul.append(superNextElement);
            ul.append(nextElement);
    
            pageContainer.append(container.append(ul));

        };
    
        /**
         * 用于渲染中间数字性页码.
         * 
         * @param start 开始的页数.
         * @param needTotal 结束的页数.
         * @return {Array} DOM数组
         */
        Pagination.prototype.createBodyNumberPages = function(start,needTotal){
    
            let HTMLDom = [];
    
            for(let i = start; i<=needTotal; i++){
    
                let ele = document.createElement("LI");
    
                ele = this.initElement(ele,"number");
    
                ele.KEY = i;

                Object.defineProperty(ele,"KEY",{
                    configurable:false,
                    writable:false,
                    enumerable:false
                });

                ele.innerText = i;
    
                ele.onclick = ()=>{ this.updatePageNum(i); };

                HTMLDom.push($(ele));
    
            };
    
            return HTMLDom;
    
        };
    
    })(window,document);