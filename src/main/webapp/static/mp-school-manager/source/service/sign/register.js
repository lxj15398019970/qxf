/**
 * 注册业务js
 */

define(function(require, exports, module) {

	// 引入依赖
	var $ = window.$;
	var lock = require("lock");
	var jqueryAuto = require("auto")($);

	var UI = {
		registerForm : $("#register-form"),
		error : $("#error"),
		spin : $(".spin"),
		school : $('#school.typeahead')

	};

	// UI.registerForm
	// .find(".register-btn")
	// .click(
	//					
	//
	// );

	window.registerFormValidate = function() {
		var password = $("#password").val();
		var confirmpassword = $("#confirmPassword").val();
		var mobile = $("#mobile").val();
		var email = $("#email").val();
		var school = $("#school").val();
		var code = $("#code").val;
		var schoolName = $("#school").val();
		var qq = $("#qq").val();
		var mobile = $("#mobile").val();
		
		
		if (email != '' && password != '' && confirmpassword != ''
				&& mobile != '' && school != '') {

			if (!/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
					.test(email)
					&& "@@@@" != email) {
				$("#email").parent().parent().addClass("has-error")
				$("#email").next().text("请输入正确的邮箱地址");
				return false;
			}

			if (password.length < 6 || password.length > 13) {
				$("#password").parent().parent().addClass("has-error");
				$("#password").next().text("请输入6-13位字母、数字或者英文符号");
				return false;
			}

			if (password != confirmpassword) {
				$("#confirmPassword").parent().parent().addClass("has-error");
				$("#confirmPassword").next().text("两次密码不一致");
				return false;
			}

			
			if(!lock.JString.isPhone(mobile)){
				$("#mobile").parent().parent().addClass("has-error");
				$("#mobile").next().text("请输入合法的手机号");
				return false;
			}
			
			if(!lock.JString.isQQ(qq)){
				$("#qq").parent().parent().addClass("has-error");
				$("#qq").next().text("请输入合法的的QQ号码");
				return false;
			}
			
			
			
			

//			if (/^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
//					.test(email)) {
//				$("#email").parent().parent().removeClass("has-error")
//				$("#email").parent().parent().addClass("has-success");
//				$("#email").next().text("ok");
//				
//			}
//			
			
			

//			if (password.length > 6 && password.length < 13) {
//				$("#password").parent().parent().removeClass("has-error");
//				$("#password").parent().parent().addClass("has-success");
//				$("#password").next().text("ok");
//			}
//			if (password == confirmpassword) {
//				$("#confirmPassword").parent().parent()
//						.removeClass("has-error");
//				$("#confirmPassword").parent().parent().addClass("has-success");
//				$("#confirmPassword").next().text("ok");
//			}
//			if (mobile.length == 11) {
//				$("#mobile").parent().parent().removeClass("has-error");
//				$("#mobile").parent().parent().addClass("has-success");
//				$("#mobile").next().text("ok");
//			}
//
//			if (code.length > 0) {
//				$("#code").parent().parent().removeClass("has-error");
//				$("#code").parent().parent().addClass("has-success");
//				$("#code").next().text("ok");
//			}
//
//			if (schoolName.length > 0) {
//				$("#school").parent().parent().removeClass("has-error");
//				$("#school").parent().parent().addClass("has-success");
//				$("#school").next().text("ok");
//			}

			
		}
		
			return true;
		
	};

	// 发送验证码
	UI.registerForm.find("#getCode").click(function() {
		Ajax.getCode($(this).closest(".form-group"));
	});

	var Ajax = {
		URL : {
			getCode : "../sign/send-email.shtml",
			getSchool : "../sign/getAllEcampusForAjax.shtml"
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
