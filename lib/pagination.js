//分页器
(function(w,d){
    
        var Pagination = w.Pagination = function(options){
    
            if(Object.prototype.toString.call(options) !== "[object Object]"){ console.error("options type must be Object"); return; }
    
            function foo(){};
    
            //配置参数
            this.containerElement = $(".pagination-list"), //页码容器
            this.pageSize = 0; //一页展示多少
            this.pageNum = 1;  //当前页数(默认为1)
            this.total = 0; //总条数
            this.showListPages = 5; //列表中最少展示几个数字标签页码.
    
            this.onChange = foo;
            this.onTest = foo;  //改变页数时用于外部验证.
    
            // 配置默认值
            this.updateOption(options);
    
            //缓存储存容器，避免每次访问.
            const pageContainer = this.containerElement;
    
            const skipPageClick = function(pageNum){ this.updatePageNum(pageNum); };
            
            //平均两边页码是多少个
            const showListAveragePages = Math.ceil((this.showListPages-1) / 2);
    
            const [left,right] = this.__calcFlanksPageNumbers(showListAveragePages);
    
            //初始更新pages列表
            this.updateViewPageList(left,right);
    
            //返回外部接口
            return (options)=>{
    
                const OPTIONS = ["containerElement","pageSize","pageNum",
                "total","showListPages","onChange","onTest"];

                for(let key in options){
                    if(OPTIONS.indexOf(key) !== -1){
                        this[key] = options[key]
                    }
                }
    
                this.updatePageNum(this.pageNum);
    
            };
    
            //不可更改内置方法.
            const innerFunction = ["updateOption","bianOptionTypes",
            "initTagElement","__calcFlanksPageNumbers","updatePageNum"];
    
            innerFunction.forEach((funcName)=>{
                Object.defineProperty(this,funcName,{
                    writeable:false,
                    configurable:false,
                    enmerable:false,
                })
            });
    
        };
    
    
        /**
         *  注册设置参数的 options 函数.
         *  @param1 {object} 参数列表
         *  @param2 {function} 回调 @param1 err  @param2 options
         *  @return null.
         *
         *  note :  持续更新类中的状态
         */
    
        Pagination.prototype.updateOption = function(obj,cb){
            for(let key in obj){
                const value = obj[key];
                this[key] = value;
            }
        };
    
        /**
         * note : 负责验证options类型
         * @return null
         */
        Pagination.prototype.bianOptionTypes = function(OPTIONS){
            const OPTIONS_TYPES = {
                containerElement(){
    
                },
                pageSize(){
    
                },
            };
    
            for(let key in OPTIONS ){
    
                const value = OPTINS[key];
    
                if(OPTIONS_TYPES[key]()){
    
                };
            };
        };
    
        /**
         * 初始化固定标签 上一页，下一页，输入框.
         */
        Pagination.prototype.initTagElement = function(){
    
            const skipPageNum = 5; //每次点击省略号跳10页
    
            //生成上下页并添加事件
            const topElement = $(this.initElement(d.createElement("LI"),"top"));
            const nextElement = $(this.initElement(d.createElement("LI"),"next"));
            const superTopElement = $(this.initElement(d.createElement("LI"),"superTop"));
            const superNextElement = $(this.initElement(d.createElement("LI"),"superNext"));
    
            topElement.html("上一页").attr("title","上一页");
            nextElement.html("下一页").attr("ttile","下一页");
    
            topElement.click(()=>{
                    this.updatePageNum(this.pageNum-1);
            });
    
            nextElement.click(()=>{
                    this.updatePageNum(this.pageNum+1);
            });
    
            superTopElement.click(()=>{
                    this.updatePageNum(this.pageNum-skipPageNum);
            });
    
            superNextElement.click(()=>{
                    this.updatePageNum(this.pageNum+skipPageNum);
            });
    
            return {
                topElement,
                nextElement,
                superTopElement,
                superNextElement,
            };
        };
    
        /**
         *
         * @param ele {HTML_DOM} DOCUMENT.ELEMENT
         * @param {string} 不同type不同初始规则.
         * @returns {HTML_DOM} 经过初始化之后的 element 元素.
         */
        Pagination.prototype.initElement = function(ele,type){
    
            let CLASSNAMES = ["pagination-list-item"];
    
            if(type === "number"){
                CLASSNAMES.push("page-number");
            }else if(type === "top"){
                CLASSNAMES.push("page-top");
            }else if(type === "next"){
                CLASSNAMES.push("page-next");
            }else{
                CLASSNAMES.push(type);
            }
    
            ele.className = CLASSNAMES.join(" ").trim();
    
            return ele;
        };
    
        /**
         * 用于更新pageNum 即展示的页数.
         *
         * concoller
         */
        Pagination.prototype.updatePageNum = function(pageNum,cb){
    
            let test = true,
                len,
                leftBoundary,  //左侧边界页码
                rightBoundary; //右侧边界页码
    
            const maxPagesNumer = Math.ceil(this.total / this.pageSize);; //根据total应显示多少页数.
    
            //平均两边页码是多少个
            const showListAveragePages = Math.ceil((this.showListPages-1) / 2);
    
            //此处全等false 依然通过
            if(this.onTest){ test = !(this.onTest(pageNum,this.pageSize) === false); };
    
            //写入规则. true为合格
            const conditions = [
                typeof pageNum === "number", //传入参数必须为number
                test,                        //外部验证必须通过.
                pageNum !== this.pageNum    //重复点击标签不触发
            ];
    
            len = conditions.length;
    
            //验证规则
            while(len--){ if(!conditions[len]){ return; } };
    
            //当前页数大于或小于，都设置维最大极限.
            if(pageNum<1){ pageNum = 1; };
    
            if(pageNum > maxPagesNumer){ pageNum = maxPagesNumer; };
    
            //跟新pageNum内部状态.
            this.pageNum = pageNum;
    
            this.onChange(this.pageNum,this.pageSize);
    
            //计算中间值,即两边分别放多少页码，使当前页码居中.
            [leftBoundary,rightBoundary] = this.__calcFlanksPageNumbers(showListAveragePages);
    
            // //处理如大于真实数据，则继续截取.
    
            //渲染页面,并设置起始页码
            this.updateViewPageList(leftBoundary,rightBoundary);
    
            cb && cb();
        };
    
        /**
         * @param boundary {number} 平均两边放多少个页码.
         *
         * @return [leftBoundary,rightBoundary] 分别是计算出来的两侧页码数
         *
         *  note 根据动态值showListPages 计算左右两侧页码.
         * */
        Pagination.prototype.__calcFlanksPageNumbers = function(showListAveragePages){
    
            //(left | right) - 平均页数 如果出现小于1大于总数的情况，不进行相减
            const maxPages = Math.ceil(this.total / this.pageSize);; //根据total应显示多少页数.
    
            const pageNum = this.pageNum;
    
            const showListPages = this.showListPages; //页码list列表可以展示几个页码标签.
    
            let left = 1 ,right = showListPages; //默认值为从第一个，到showListPages长度(除自己)
    
            let t = true;
    
            //左侧的页码"不够分"时，直接返回当前默认值.
            if(pageNum - showListAveragePages <= 0){
               //左侧值不够分呀
               t= false;
            }else if((pageNum + showListAveragePages) > maxPages){
                //右侧值不可超过真实长度,如大于，则返回 showListPages
                //右侧页不够分，－1不算自己
                left = Math.max(maxPages - showListPages+1,1); right = maxPages;
                t = false;
            }
    
            if(t){
                //说明需要，左或右可以平分标签.
                left = pageNum - showListAveragePages;
    
                right = pageNum + showListAveragePages;
            }
    
            //右侧值大于真实页数时,放到最大.
            return [left,Math.min(right,maxPages)]
    
        };
    
        /**
         *  更新显示的list，只负责渲染，不负责逻辑.
         *
         *  @param start {number}  从哪个页码开始.
         *
         */
        Pagination.prototype.updateViewPageList = function(start = 1,end){
    
            end = end || this.showListPages;
    
            const pageContainer = this.containerElement;  //获取容器元素
    
            //记录当前展示的页数区间.
            const bpdyPagesNumbers = this.createBodyNumberPages(start,end);
    
            const {topElement,nextElement,superTopElement,superNextElement} = this.initTagElement();
    
            pageContainer.empty();
    
            //上一页
            pageContainer.append(topElement);
            pageContainer.append(superTopElement);
    
            bpdyPagesNumbers.forEach((ele,k)=>{
                if(ele[0].KEY === this.pageNum){
                    ele.addClass("active");
                };
                pageContainer.append(ele);
            });
    
            //下一页
            pageContainer.append(superNextElement);
            pageContainer.append(nextElement);
    
        };
    
        /**
         *
         * @param start 开始的页数.
         *
         * @param needTotal 需要的最后的页数 pages.
         *
         * @reutrn Array HTMLDom
         */
        Pagination.prototype.createBodyNumberPages = function(start,needTotal){
    
            let HTMLDom = [];
    
            //中间层
            for(let i = start; i<=needTotal; i++){
    
                let ele = document.createElement("LI");
    
                //初始化element
                ele = this.initElement(ele,"number");
    
                ele.KEY = i;
    
                //填充需要展示的页数.
                ele.innerText = i;
    
                //设置点击
                ele.onclick = ()=>{ this.updatePageNum(i); };
    
                //number 数字标签
                HTMLDom.push($(ele));
    
            };
    
            return HTMLDom;
    
        };
    
    })(window,document);