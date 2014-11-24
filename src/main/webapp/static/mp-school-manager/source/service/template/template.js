
define(function(require, exports, module){
	
	
	
	
    //引入依赖
    window.$  = require("$");
    window.jQuery = $;
    var bp = require("bp")(window.$);
    var bp_switch = require("bp_switch")(window.$);
    //初始化 工具提示
    $('[data-type="tooltip"]').tooltip();
    
    //快速读取json文件
    
    
    
    
    
    
    
    //如果当前页面有错误提示错误
    var lock = require("lock");
    var error = $("#error").val();
    if(!lock.JString.isEmpty(error)){
        lock.alertMsg.error("错误",error);
    };


    var   $mpSelectUI = $("#mpListSelect");

    var Ajax = {
        URL : { mpList : "../user/mpListAjax.shtml", changeMpList : "../user/mp-list-on-change.shtml"},
        //获得当前公众账号列表
        getMpList : function(){
            lock.AjaxUtil.get(Ajax.URL.mpList,{},function(result){
                var data = {
                    result : result
                };
//                 console.log(result)                
                if(result == '' || result == null){
                	$mpSelectUI.parent().hide();
                }else{
                	lock.WebPage.refreshTemplate($mpSelectUI,data,$("#mpListSelectTemplate"));
                	$mpSelectUI.parent().show();
                }
                
            },lock.AjaxUtil.ajaxError);
        },

        //改变公众账号事件
        changeMpList : function(id){
            lock.AjaxUtil.get(Ajax.URL.changeMpList,{id:id},function(result){
                if(result == "0"){
                    lock.alertMsg.error("错误","出现错误,请重试!");
                }
                else if(result == "1"){
                    lock.alertMsg.success("成功","切换成功");
                    lock.WebPage.jumpPage("../home/init.shtml",1200);
                }
                else{
                    lock.alertMsg.warn("未知","未知返回值");
                }
            },lock.AjaxUtil.ajaxError);

        }
    };


    //绑定切换
    $mpSelectUI.on("change",function(){
        var $this = $(this);
        Ajax.changeMpList($this.val());
    });

    //init
    Ajax.getMpList();
    
    //back
    $(".his-return").click(function(){
    	lock.WebPage.back();
    });
    
    
    //表情地址
    
    
});
