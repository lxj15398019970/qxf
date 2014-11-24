/**
 * 工具整合类 
 * @author  sherlock
 * @description 包含 : ajax-util.js
 * 					  string-util.js
 * 		 			  webpage-util.js
 * 					  alertMessage
 */

define(function(require, exports, module) {

var $ = require("$");
var tp  =  require("tp");
var chart = require("chart");
var Lock = {};


    /**
     * 特效动画
     * @type {{numberScroll: numberScroll}}
     */
    Lock.animate  = {

        /**
         * 数字滚动
         * @param $dom
         * @returns {number}
         */
       numberScroll : function($dom){
        var a_num = $dom.attr("data-num") * 1;
        var a = 1;
        var crear_a = ""
        var change_a = function() {
            if (a <a_num) {
                a += 4;
                $dom.text(a);
            }
            else{
                $dom.text(a_num);
                clearInterval(crear_a);
            }

        }
        crear_a = setInterval(change_a, (3000 / a_num));
        return crear_a;
    }

};


    Lock.model  = {
        dataModel : function(title,content,okFn){
            var modal = $("#modalData");
                modal.find(".modal-title").html(title);
                modal.find(".modal-body").html(content);
        },
        templateModel : function(title,data,tempalte,hFooter,okFn){
            //渲染显示
            var modal = $("#modalData");
            modal.find(".modal-title").html(title);
            Lock.WebPage.refreshTemplate(modal.find(".modal-body"),data,tempalte);
            if(hFooter == true){
                modal.find(".modal-footer").hide();
            }
        },
        confirm : function(content, okFn) {
            //渲染显示
            var modal = $("#confirmModel");
            modal.find(".modal-title").html("确认操作");
            modal.find(".modal-body").find("p").html(content);
            var btnPri = modal.find(".modal-footer").find(".btn-primary");
            btnPri.one("click",function(){
                okFn();
                modal.modal("hide");
            });
            modal.find(".modal-footer").find(".btn-default").one("click",function(){
            	btnPri.unbind("click");
            });
            modal.modal("show");
        }
    };



    Lock.alertMsg = {
        alertTimer : "",

	/**
	 * 错误信息提示
	 */
	error : function(title,content,enabledTimer,time) {
        var $alert = $("#alert-lock");
        $alert.removeClass("alert-warning alert-info  alert-success").addClass(" alert-danger");
        Lock.alertMsg.execute($alert,title,content,enabledTimer,time);
	},
	/**
	 * 警告信息提示
	 */
	warn : function(title,content,enabledTimer,time) {
        var $alert = $("#alert-lock");
        $alert.removeClass("alert-success alert-info  alert-danger").addClass("alert-warning");
        Lock.alertMsg.execute($alert,title,content,enabledTimer,time);
	},

     execute : function($alert,title,content,enabledTimer,time){
         $alert.find(".alert-lock-title").html(title);
         $alert.find(".alert-lock-body").html(content);
         //计算水平居中
         var marginLeft = "-"+($alert.width()/2)+"px";
         $alert.css({marginLeft: marginLeft});

         $alert.show();
         if(enabledTimer != false){
             if(!Lock.alertMsg.alertTimer){
                 Lock.alertMsg.alertTimer = setTimeout(function(){
                     $alert.hide();
                     Lock.alertMsg.alertTimer = "";

                 },time == undefined ? 2200 : time);
             }
         };



     },
	// 成功信息提示
	success : function(title,content,enabledTimer,time) {
        var $alert = $("#alert-lock");
        $alert.removeClass("alert-warning alert-info  alert-danger").addClass("alert-success");
        Lock.alertMsg.execute($alert,title,content,enabledTimer,time);
	},
    // 成功信息提示
        info : function(title,content,enabledTimer,time) {
            var $alert = $("#alert-lock");
            $alert.removeClass("alert-warning alert-success  alert-danger").addClass("alert-info");
            Lock.alertMsg.execute($alert,title,content,enabledTimer,time);
        },
	/**
	 * 确认
	 * 
	 * @param {String} 消息内容
	 * @param {Function} 确定按钮回调函数
	 * @param {Function} 取消按钮回调函数
	 */
	confirm : function(content, yes, no) {
		var dialog = art.dialog({
			id : "artDialogConfirm",
			title : "操作确认",
			content : "<div class='artConfirmMsg'>" + content + "</div>",
			icon : 'question',
			drag : false,// 禁止拖拽
			resize : false,
			fixed : true,// 开启静止定位
			lock : true,// 开启锁屏
			opacity : 0.1,// 锁屏遮罩透明度
			ok : function(here) {
				return yes.call(this, here);
			},
			cancel : function(here) {
				return no && no.call(this, here);
			}
		});
	}
};

    //关闭按钮
    $("#alert-lock").find(".close").on("click",function(){
       clearTimeout(Lock.alertMsg.alertTimer);
        Lock.alertMsg.alertTimer = "";
        $("#alert-lock").hide();
    });

/**
 * loading交互
 * @class Load
 * @type {{show: show, hide: hide}}
 */
Lock.Load = {
    show : function(){
        $("#loading").show();
    },
    hide : function(){
        $("#loading").hide();
    }
};
/**
 * 异步请求工具类
 * 需要jquery.x版本支持
 * 封装了常用的ajax操作
 * @class AjaxUtil
 */
Lock.AjaxUtil = {

	/**
	 * 异步提交表单数据(post)
	 * @param {Object} url 请求地址
	 * @param {Object} form 表单form
	 * @param {Object} fn_succes 成功回调函数
	 * @param {Object} fn_error  失败回调函数
	 * @param {Object} dataType  返回类型(默认json)
	 */
	postForm : function(url, form, fn_succes, fn_error, dataType) {
        Lock.AjaxUtil.ajaxForm("post", url, form, fn_succes, fn_error, dataType == undefined ? "json" : dataType);
	},

	/**
	 * 异步提交表单数据(get)
	 * @param {Object} url 请求地址
	 * @param {Object} form 表单form
	 * @param {Object} fn_succes 成功回调函数
	 * @param {Object} fn_error 失败回调函数
	 * @param {Object} dataType 返回类型(默认json)
	 */
	getForm : function(url, form, fn_succes, fn_error, dataType) {
        Lock.AjaxUtil.ajaxForm("get", url, form, fn_succes, fn_error, dataType == undefined ? "json" : dataType);
	},

	ajaxForm : function(type, url, form, fn_succes, fn_error, dataType) {
		var seriz;
		if ( form instanceof Array)
			seriz = form.serialize(form);
		else
			seriz = form.serialize(form);
		$.ajax({
			type : type,
			url : url,
			data : seriz,
			success : fn_succes,
			error : fn_error,
			dataType : dataType
		});
	},

	/**
	 * 异步提交请求(get) 返回json
	 * @param {Object} url
	 * @param {Object} data
	 * @param {Object} fn
	 */
	get : function(url, data, fn_succes,fn_error) {
			$.ajax({
			type : "get",
			url : url,
			data : data,
			success : fn_succes,
			error : fn_error,
			dataType : "json"
		});
	},

	/**
	 * 异步提交请求(post) 返回json
	 * @param {Object} url 请求地址
	 * @param {Object} data 请求参数
	 * @param {Object} fn   成功回调函数
	 */
	post : function(url, data, fn_succes,fn_error) {
		$.ajax({
			type : "post",
			url : url,
			data : data,
			success : fn_succes,
			error : fn_error,
			dataType : "json"
		});
	},

	/**
	 * 载入并执行js
	 * @param {Object} url  js地址
	 * @param {Object} fn   成功载入回调函数
	 */
	getScript : function(url, fn) {
		$.getScript(url, fn);
	},

	/**
	 * 载入json数据
	 * @param {Object} jsonUrl json/js地址
	 * @param {Object} fn  成功载入回调函数
	 */
	getJSON : function(jsonUrl,data,fn) {
		$.getJSON(jsonUrl, data, fn);
	},

	/**
	 * 载入html文档
	 * @param {Object} htmlUrl 文档url
	 * @param {Object} data    数据
	 * @param {Object} fn      回调函数
	 */
	loadHtml : function(htmlUrl, data, fn) {
		$.load(htmlUrl, data, fn);
	}
};


/**
 * ajax全局事件
 * 实现 ajax_global 的方法
 * 启动全局事件 AJAX_GLOBAL.global();
 * @class AJAX_GLOBAL
 */
Lock.AJAX_GLOBAL = {
	USER_AJAX_GLOBAL : true,
	global : function() {
			$(document).ajaxStart(AJAX_GLOBAL.onStart)
						.ajaxComplete(AJAX_GLOBAL.onComplete)
						.ajaxSuccess(AJAX_GLOBAL.onSuccess);
	},
	onStart : function() {
        Load.show();
	},
	onComplete : function(evt, data, setting) {
        Load.hide();
	},
	onSuccess : function(evt, data, setting) {
		
	}
};



//服务器异常
Lock.AjaxError = function(error){
    //    Lock.alertMsg.error("提示","服务器异常!");
};





//自动补全
 Lock.Auto = {
      substringMatcher : function(strs) {
         return function findMatches(q, cb) {
             var matches, substrRegex;
             matches = [];
             // regex used to determine if a string contains the substring `q`
             substrRegex = new RegExp(q, 'i');
             // iterate through the pool of strings and for any string that
             // contains the substring `q`, add it to the `matches` array
             $.each(strs, function(i, str) {
                 if (substrRegex.test(str)) {
                     // the typeahead jQuery plugin expects suggestions to a
                     // JavaScript object, refer to typeahead docs for more info
                     matches.push({
                         value : str
                     });
                 }
             });
             cb(matches);
         };
     }

 };
/**
 * 页面常用方法
 * @class WebPage
 */
Lock.WebPage = {
	
		
	back : function(){
			window.history.go(-1);
	},	
		
	 /**
     * 分解DOM名称，已spe分割
     * @param doms  分解dom集合
     * @param spe   分隔符
     * @returns {string}
     */
    sliceName : function(doms,spe){
        var array = new Array();
        for(var i =0; i<doms.length ; i++){
            var $obj = $(doms[i]);
            var name = $obj.attr("name");
            array.push(name);
        }

       if(JString.isEmpty(spe)) spe = ",";

        return array.join(spe)
    },

    /**
     * checkbox全选多选
     * @param doms
     * @param selected
     */
    toggleCheckBox : function(cklists,selected){
        var cklistTemp;
        if(!selected){
            cklistTemp = cklists.filter(":checked");
        }
        else{
            cklistTemp = cklists.not("input:checked");
        }

        for(var i=0; i<cklistTemp.length;i++){
            var ck = cklistTemp[i];
            $(ck).click();
        }
    },

    /**
     * 渲染art
     * @param message
     * @param iconUrl
     * @returns {string}
     */
    artContent : function(message,iconUrl){
        var content = '<div><img src="'+iconUrl+'"/> <p class="display-inline-block alert-message">'+message+'</p></div>';
        return content;
    },
    /**
     * @description 询问窗口
     * @param content  内容
     * @param fn       确定 执行的方法
     */
    confirm : function(content,iconUrl,fn){
        content = WebPage.artContent(content,iconUrl);
        art.dialog({
            content: content,
            ok: function () {
                fn();
                return true;
            },
            lock : true,
            opacity : 0.8,// 锁屏遮罩透明度
            cancelVal: '取消',
            cancel: true //为true等价于function(){}
        });
    },

    /**
     * @description   警告窗口
     * @param type    类型
     * @param title   标题
     * @param content 内容
     */
    warnTip : function(type,title,content){
        content = WebPage.artContent(content);
        if(!title){title = ""}
        if(!content){content=""}
        if(type ==  ResultModel.results.AJAX_ERROR){
            title = "警告";
            content = "您没权限执行此操作!如有问题请联系客服";
        }
        else if(type == ResultModel.results.AJAX_EXCEPTION){
            title = "警告";
            content = "服务器出现异常!请重新操作!如有问题请联系客服";
        }
        art.dialog({
            title   : title,
            content : content,
            lock : true,
            button : [
                {
                    name : "查看客服电话",
                    callback : function(){
                        this.content("");
                        return false;
                    }
                },

                {
                    name : "关闭窗口",
                    callback : function(){
                        return true;
                    }
                }
            ]

        });
    },

    /**
     * @description	  信息窗口
     * @param title   标题
     * @param content 内容
     */
    messageTip : function(title,content,isLock,time){
        content = WebPage.artContent(content);
        art.dialog({
            title   : title,
            content : content,
            lock  : isLock,
            opacity : 0.8,
            time  : time == undefined ? null : time,
            ok      : function(){
                return true;
            }
        });
    },
	
	
	
			
	/**
	 * @description 计算总页数(分页)
	 * @param count
	 *            数据总量
	 * @param p
	 *            分页对象
	 * @return p 分页对象
	 */
	pageSlice : function(count, table) {
        var p =  table.data("page");
        p.total = count % p.size == 0 ? count / p.size : (parseInt(count
            / p.size) + 1);
        table.data("page", p);
	},



	createPage : function($dom, index, size, total) {
		var page = {
			total : total == undefined ? 0 : total,
			index : index == undefined ? 1 : index,
			size : size == undefined ? 10 : size
		};
		$dom.data("page", page);
	},
	/**
	 * @description 范围检查(分页)
	 * @param p
	 *            分页对象
	 * @return p 分页对象
	 */
	pageCheck : function(p) {
		if (p.index > p.total) {
			p.index = p.total;
		} else if (p.index <= 0) {
			p.index = 1;
		}
		return p;
	},

    /**
     * @description 触发分页按钮
     * @param type  上下页
     * @param page  页数对象(index total)
     * @returns {p}
     */
    pageTrigger : function(type,page){

        if(type == "prev"){
               page.index--;
        }
        else if( type =="next"){
                page.index++;
        }
       return WebPage.pageCheck(page);
    },

	/**
	 * @description 绑定上下页
	 * @param $main
	 *            上下页按钮所在的父层
	 * @param $fn
	 *            执行方法
	 */
	pageBind : function($main, $fn) {
		var page = $main.data("page");
		$main.find("[pos='prev']").unbind("click").click(fn);
		$main.find("[pos='next']").unbind("click").click(fn);
		function fn() {
			var $this = $(this);
			var type = $this.attr("pos");
			type == "prev" ? page.index-- : page.index++;
			// 检查范围
			var p1 = WebPage.pageCheck(page);
			// 更新page
			$main.data("page", p1);
			// 执行加载数据方法
			$fn();
		}
	},

	/**
	 * 渲染模板
	 * 
	 * @param $dom
	 * @param data
	 * @param $template
	 */
	refreshTemplate : function($dom, data, $template,append) {
		// 原生方法
		var source = $template.html();
		// 预编译模板
		var tm = tp.compile(source);
		// 匹配json内容
		var html = tm(data);
		// // 输入模板
		if(append)
			$dom.append(html);

		else
			$dom.html(html);
			
	},
	
	/**
	 * @description 等呆几秒后 刷新页面
	 * @param time
	 *            等待毫秒数
	 */
	reloadPage : function(time) {
		var fn = function() {
			window.location = window.location;
		};
		if (!time) {
			time = 0;
		}
		setTimeout(fn, time)
	},

	/**
	 * @description 等待几秒 跳转页面
	 * @param url
	 *            跳转路径
	 * @param time
	 *            等待毫秒数
	 */
	jumpPage : function(url, time) {
		var fn = function() {
			window.location.href = url;
		};
		if (!time) {
			time = 0;
		}
		setTimeout(fn, time)
	}
};

/**
 * 字符串工具类
 * @class JString
 */
Lock.JString = {

    /**
     * @description 判断值是否为undefined
     * @param $dom  dom对象 或者 任意数值
     * @returns {boolean} true : undefined , false  : 非undefined
     */
    isUndefined : function($dom){
        if(!$dom){return true}
        return false
    },
    /**
     * @description 非空判断(判断以下:undefend,null,"")
     * @param str   字符串
     * @returns {boolean} true : 空 , false  : 非空
     */
    isEmpty : function(str){
        if( undefined == str || null == str  || "" == str ){
            return true;
        }
        return false;
    },

    /**
     * @description 将字符串解析成html标签
     * @param str   带解析的字符串
     * @returns {string}  解析完成后字符串
     */
    parseHtml : function (str)
    {
        String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
            if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
                return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
            } else {
                return this.replace(reallyDo, replaceWith);
            }
        }
        //str含有HTML标签的文本
        str = str.replaceAll("<","&lt;");
        str = str.replaceAll(">","&gt;");
        str = str.replaceAll(" ","&nbsp;");
        str = str.replaceAll("\n","<br>");
        str = str.replaceAll("&","&amp;");
        return str.toString();
    },

    /**
     * @description 替换后缀名(a.mp3 -->b.mp4)
     * @param   str 原始字符
     * @param   identifier 原始标志
     * @param   target  替换标志
     * @return  {string} 替换后字符串
     */
    replaceLastChar : function(str,identifier,target){
        var last = str.lastIndexOf(identifier);
        return (str.substring(0,last+1)+target);
    },

    /**
     * @description  去掉字符串中所有空格 is_globa = 'g'
     * @param   str 原始字符
     * @param   identifier 原始标志
     * @param   target  替换标志
     * @result  {{去掉之后的字符串}}
     */
    trimAll : function(str,is_global){
        var result;
        result = str.replace(/(^\s+)|(\s+$)/g,"");
        if(is_global.toLowerCase()=="g")
            result = result.replace(/\s/g,"");
        return result;
    },
    /**
     * @description  去掉左右两边的空格
     * @param   str 原始字符
     * @param   type  l:左边  r:右边  lr : 左右两边
     * @result  {{去掉之后的字符串}}
     */
    trim : function(str,type){
        var  regs = /\s+/g;
        if(type == 'l'){
            regs =  /^\s*/;
        }
        else if( type == 'r')
        {
            regs = /(\s*$)/g;
        }
        else if(type == 'lr')
        {
            regs = /^\s+|\s+$/g;
        }
        return  str.replace(regs,"");
    },

    /**
     * @description 获得主机地址|项目名|目录地址
     * @returns {{localhost: 主机地址, project: 项目名称 pathName : 目录地址}}
     */
    getUrl: function(){
        var curWwwPath = window.document.location.href;
        var pathName = window.document.location.pathname;          //获取主机地址之后的目录，如： cis/website/meun.htm
        var pos = curWwwPath.indexOf(pathName);                    //获取主机地址，如： http://localhost:8080
        var localhostPaht = curWwwPath.substring(0, pos);          //获取带"/"的项目名，如：/cis
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        var rootPath = localhostPaht + projectName;
        return {
            localhost : pos,
            project   : projectName,
            pathName  : pathName
        }
    },
    getParamByName : function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);{return null};
    },


    /**
     * 检查是否是按键值
     * @param key  按键值
     * @returns {boolean} true : 是 ,false :不是
     */
    vdIsKey : function(key){
        var zz = /^\d$/;
        return zz.test(key);
    },

    /**
     * 判断是否为数字
     * @param num    字符
     * @returns {boolean}  true : 是 , false :不是
     */
    vdIsNum : function(num){
        var zz = /^\d+$/;
        return zz.test(num);
    },
    /**
     * 判断是否为qq号码
     * @param str qq号
     * @returns {boolean}    true:是 ,false :不是
     */
    isQQ:function(str) {
        if (/^\d{5,14}$/.test(str)) {
            return true;
        }
        return false;
    } ,

    /**
     * 判断是否为手机
     * @param str 手机号
     * @returns {boolean}    true:是 ,false :不是
     */
    isPhone : function(str){
        var reg = /^0?1[7358]\d{9}$/;
        return reg.test(str);
    },
    /**
     * 判断是否为邮箱
     * @param str 邮箱
     * @returns {boolean}    true:是 ,false :不是
     */
    isEmail : function(str){
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        return reg.test(str);
    },
    /**
     * 判断是否正整数
     * @param str 数值
     * @returns {boolean}    true:是 ,false :不是
     */
    isPlusNumber   : function(str){
        var reg = /^[0-9]*[1-9][0-9]*$/;
        return reg.test(str);

    },
    /**
     * 判断是否正数 不包括0
     * @param str 数值
     * @returns {boolean}    true:是 ,false :不是
     */
    isNumric : function(str){
        var reg = /^(([0-9]+[\.]?[0-9]+)|[1-9])$/;
        return reg.test(str);
    }

};
/**
 * 图表
 * @class chart
 */
Lock.chart = {
	/**
	 * 曲线图
	 * @description  曲线图
	 * @param dates 横轴 日期时间
	 * @param datas 纵轴 数据
	 */
	lineChart : function(dates,datas){
		var lineChartData = {
 			labels : dates,
 			datasets : [ {
 				fillColor : "rgba(151,187,205,0.2)",
 				strokeColor : "rgba(151,187,205,1)",
 				pointColor : "rgba(151,187,205,1)",
 				pointStrokeColor : "#fff",
 				pointHighlightFill : "#fff",
 				pointHighlightStroke : "rgba(151,187,205,1)",
 				data : datas
 			} ]
 		}
 		var ctx = document.getElementById("canvas").getContext("2d");
 		window.myLine = new Chart(ctx).Line(lineChartData, {
 			responsive : true
 		});
	}
}

    module.exports = Lock;

});


