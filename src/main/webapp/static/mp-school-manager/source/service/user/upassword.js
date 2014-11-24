/**
 * 注册业务js
 */

define(function(require, exports, module) {
	//引入依赖
	var $ = window.$;
	var lock = require("lock");

	var UI = {
		passWordForm : $("#upassword-form"),
		error : $("#error")
	};
	//修改密码
	UI.passWordForm.find("[type='submit']").click(function() {
		var pos = 0;
		var oldPassword = $("#password").val();
		var newPassword = $("#newPassword").val();
		var confirmPassword = $("#confirmPassword").val();
		if (oldPassword == '' || newPassword == '' || confirmPassword == '') {
			return true;
		}
		if (newPassword.length < 6) {
			$("#password").parent().parent().removeClass("has-error");
			$("#password").parent().parent().addClass("has-success");
			$("#password").next().text("正确");
			$("#newPassword").parent().parent().addClass("has-error");
			$("#newPassword").next().text("密码长度不够");
			return false;
		}

		if (confirmPassword.length < 6) {
			$("#newPassword").parent().parent().removeClass("has-error");
			$("#newPassword").parent().parent().addClass("has-success");
			$("#newPassword").next().text("正确");

			$("#confirmPassword").parent().parent().addClass("has-error");
			$("#confirmPassword").next().text("密码长度不够");
		
			
			return false;
		}

		if (newPassword != confirmPassword) {
			$("#confirmPassword").parent().parent().addClass("has-error");
			$("#confirmPassword").next().text("两次密码不一致");
			return false;
		}
		$("#confirmPassword").parent().parent().removeClass("has-error");
		$("#confirmPassword").parent().parent().addClass("has-success");
		$("#confirmPassword").next().text("正确");
		
		Ajax.upPwd();
	});

	var Ajax = {
		URL : {
			upPwd : UI.passWordForm.attr("action")
		},
		//验证
		upPwd : function() {

			lock.AjaxUtil.postForm(Ajax.URL.upPwd, UI.passWordForm, function(
					result) {
				//提示信息
				lock.alertMsg.warn("提示", result);
			}, lock.AjaxError);

		}

	};

});
