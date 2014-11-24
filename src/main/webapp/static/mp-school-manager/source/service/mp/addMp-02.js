/**
 * 添加账号业务js
 */



define(function(require, exports, module) {

    //引入依赖
    var  $ = window.$;
    var lock = require("lock");
    var  z_clip = require("zclip");

    var UI = {
        copyDom : $(".copy")
    };



    $(function(){



        UI.copyDom.zclip({
            path: "/mp/static/mp-school-manager/source/external/zclip/ZeroClipboard.swf",
            copy: function(){
                var $input = $(this).closest(".form-group").find("input[type='text']");
                return $input.val();
            },
            beforeCopy:function(){/* 按住鼠标时的操作 */
                $(this).text("已复制");
            },
            afterCopy:function(){
                lock.alertMsg.success("","已经成功复制到剪切板!");
            }
        });

//        UI.copyDom.click(function(){
//
//            var $this = $(this);
//            var $input = $this.closest(".form-group").find("input[type='text']");
//            $input[0].select();
//
//
//
//        });

    });



});