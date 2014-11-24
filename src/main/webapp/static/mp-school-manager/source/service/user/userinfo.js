


/**
 * 修改用户信息业务js
 */

define(function(require, exports, module) {

    //引入依赖
    var $ = window.$;
    var lock = require("lock");
    var jqueryAuto = require("auto")($);

    var UI = {
        userInfoForm: $("#userInfo-form"),
        error: $("#error"),
        school: $('#school.typeahead'),
        spin: $(".spin")
    };


    //切换修改
    UI.userInfoForm.find(".editor").on("click", function () {
        var $this = $(this);
        var type = $this.attr("type");
        var $pt = $this.parent().parent();
        $this.hide();

        if (type == "return")
            toggleFn($pt, false);
        else
            toggleFn($pt, true);

    });


    var substringMatcher = function (strs) {
        return function findMatches(q, cb) {
            var matches, substrRegex;
            matches = [];
            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');
            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function (i, str) {
                if (substrRegex.test(str)) {
                    // the typeahead jQuery plugin expects suggestions to a
                    // JavaScript object, refer to typeahead docs for more info
                    matches.push({ value: str });
                }
            });
            cb(matches);
        };
    };

    var toggleFn = function ($pt, isShow) {
        if (isShow) {
            $pt.find(".enabledForm").show();
            $pt.find(".disabledForm").hide();
        }
        else {
            $pt.find(".enabledForm").hide();
            $pt.find(".disabledForm").show();
        }
    }

    //修改用户信息
    UI.userInfoForm.find("[type='submit']").click(function () {
           	
    	var mobile = UI.userInfoForm.find("[name='phone']").val();
    	var qq = UI.userInfoForm.find("[name='qq']").val();
    	
    	if(!lock.JString.isPhone(mobile)){
    		   lock.alertMsg.error("提示","手机号码不合法");
			return false;
		}
		
		if(!lock.JString.isQQ(qq)){
			   lock.alertMsg.error("提示","qq号码不合法");
			return false;
		}
		
        Ajax.upInfo();
    });

    var Ajax = {
        URL: { upInfo: UI.userInfoForm.attr("action"), getSchool: "../sign/getAllEcampusForAjax.shtml" },
        upInfo: function () {
            lock.AjaxUtil.postForm(Ajax.URL.upInfo, UI.userInfoForm, function (result) {
                //提示信息
                lock.alertMsg.info("提示", result);
                lock.WebPage.jumpPage("../user/account-input.shtml", 1200);
            }, lock.AjaxError);

        }

    }

});
