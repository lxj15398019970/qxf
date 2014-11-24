/**
 * 添加账号业务js
 */

define(function(require, exports, module) {

    //引入依赖
    var  $ = window.$;
    var lock = require("lock");
    var  bp_auto = require("auto")($);

    var UI = {
        spin : $(".spin"),
        school : $("#school")
    };

    
    
    var Ajax = {
        URL : {
            getSchool : "../sign/getAllEcampusForAjax.shtml"
        },
        getSchool : function() {
            // 加载动画
            UI.spin.addClass("spin normal");
            UI.spin.show();
            lock.AjaxUtil.get(Ajax.URL.getSchool, {}, function(result) {
                UI.school.typeahead({
                    hint : true,
                    highlight : true,
                    minLength : 1
                }, {
                    name : 'states',
                    displayKey : 'value',
                    source : lock.Auto.substringMatcher(result)
                });

                // 关闭
                UI.spin.removeClass("spin normal");
                //显示重要
                //UI.school.removeAttr("disabled");
                UI.spin.hide();

            }, lock.AjaxError);
        }
    };

    //加载学校
    Ajax.getSchool();

});