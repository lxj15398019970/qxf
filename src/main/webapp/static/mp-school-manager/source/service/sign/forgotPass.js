/**
 * 注册业务js
 */

define(function(require, exports, module) {

	// 引入依赖
	var $ = window.$;
	var lock = require("lock");

	var UI = {
        Form : $("#forget-form"),
		error : $("#error")
	};


	// 发送验证码
	UI.Form.find("#getCode").click(function() {
		Ajax.getCode($(this).closest(".form-group"));
	});




	var Ajax = {
		URL : {
			getCode : "../sign/forgot-password-send-email.shtml"
		},
		// 获取验证码
		getCode : function($gp) {
			// 执行异步提交
			var email = $("#email").val();
			lock.AjaxUtil.post(Ajax.URL.getCode, {
				email : email
			}, function(result) {
				// 填充信息到
				$gp.find(".help-block").html(result)
			}, lock.AjaxError);

		}
	};


});
