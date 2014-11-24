/**
 * 添加账号业务js
 */

define(function(require, exports, module) {

    //引入依赖
    var  $ = window.$;
    var lock = require("lock");

    var UI = {
    };

    //删除
    $("#setting-table").on("click",".openAccount-delete",function(){
        var $this = $(this);
        var dataUrl = $this.attr("data-url");
        lock.model.confirm("确定删除公众账号吗?",function(){
            lock.WebPage.jumpPage(dataUrl,0);
        });


    });

});