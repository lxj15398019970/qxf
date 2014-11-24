/**
 * 我有需求业务js
 */

define(function(require, exports, module) {

    //引入依赖
    var  $ = window.$;
    var lock = require("lock");

    var UI = {
        needsForm : $("#needs-form"),
        error     : $("#error")
    };
    //修改密码
    UI.needsForm.find("[type='submit']").click(function(){
    	var content = UI.needsForm.find("[name='content']").val().trim();
    	if(content == ''){
    		 lock.alertMsg.error("提示","内容不能为空");
    		 return false;
    	}
    	
    	if(content.length > 1500){
   		 lock.alertMsg.error("提示","内容超出限制，不能超过1500个字");
   		 return false;
       	}
        Ajax.needs();
    });

    var Ajax = {
        URL : { needs :  UI.needsForm.attr("action") },
        needs : function(){
            lock.AjaxUtil.postForm(Ajax.URL.needs,UI.needsForm,function(result){
                lock.alertMsg.warn("提示",result);
                UI.needsForm.find("[name='content']").val("");
            },lock.AjaxError);
        }
    };


});