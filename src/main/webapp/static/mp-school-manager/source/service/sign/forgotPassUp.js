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


});
