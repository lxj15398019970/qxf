/**
 * 功能配置业务js
 */

define(function(require, exports, module) {

    var lock = require("lock");
    var $ = window.$;

    var UI = {
        SWITCH : $("[data-name='switch']"),
        editeKeyWordsBtn : $(".editeKeyWordsBtn"),
        editeKeyWordsModel : $("#editeKeyWordsModel"),
        keyWords : $("#keyWords"),
        serverName : $("#serverName"),
        subKeyWordsBtn : $("#subKeyWordsBtn"),
        KeyWordsDataId : $("#editeKeyWordsModel[KeyWordsDataId]")
    };


    //初始化switch
    UI.SWITCH.bootstrapSwitch({
        size : "small",
        //switch 变化事件
        onSwitchChange : function(event,status){
            //state 为选中状态
        	var $this = $(this);
            Ajax.updateSetting($this.val(),status);
        }
    });
    var Ajax = {
         URL : { updateSetting : "add-function.shtml" },
         updateSetting : function(_id,status){
            //执行异步提交
             lock.AjaxUtil.post(Ajax.URL.updateSetting,{fId:_id,status:status},
            		 function(result){
                                lock.alertMsg.success("提示",result);
             },lock.AjaxError);
         }

    };
    
    // 编辑关键词
	UI.editeKeyWordsBtn.on("click",function() {
		var curKeyWords = $(this).prev().text(),
			serverName = $(this).attr("fun-name");
			keyId = $(this).closest("tr").attr("id");
		UI.editeKeyWordsModel.modal("show");
		UI.keyWords.val(curKeyWords);
		UI.serverName.text(serverName);
		UI.editeKeyWordsModel.attr("KeyWordsDataId",keyId);
	});
	

    $('#keyWords').on('keydown',function(event) {
        if (event.which == 13) {
        	keyWordsSubmit();
        	return false;
        }
    });


	// 保存关键词
	UI.subKeyWordsBtn.on("click",function(){
		keyWordsSubmit();
	})
	
	
	function keyWordsSubmit(){
		var KeyWordsId = UI.editeKeyWordsModel.attr("KeyWordsDataId"),
		keyWordsVal = UI.keyWords.val().trim();
		if(keyWordsVal == null || keyWordsVal == ""){
			lock.alertMsg.error("失败", "关键词不能为空！");
			return false;
		}
		
		if(keyWordsVal.length >20){
			lock.alertMsg.error("失败", "长度不能超过20个字符");
			return false;
		}
		
		var list = keyWordsVal.split(',');
		if(list.length >5){
			lock.alertMsg.error("失败", "关键词个数不能超过5个");
			return false;
		}
		$.ajax({
	    	type: "POST",
			dataType: "json",
			url: "add-function-key.shtml", 
			data: {
				keys:keyWordsVal,
				functionId:keyId
			}, 
			success: function (result) {  
				if(result.status == "0"){
					lock.alertMsg.error("失败", result.result);
				}
				else if(result.status == "1"){
					lock.alertMsg.success("成功", result.result);
					UI.editeKeyWordsModel.find("#cancelKeyBtn").click();
					window.location.href="setting.shtml";
				}
			},
			error: function (result) {
				lock.alertMsg.error("失败", "服务器出现错误！");
			}
	    });
    		
		
		
		
	}
	
	




});
