/**
 * Created with IntelliJ IDEA.
 * User: aobo
 * Date: 14-1-8
 * Time: 上午10:59
 * seajs 的配置文件
 */
seajs.config({
    base: "/mp/static/mp-school-manager",
    //设置别名
    alias: {
        "$": "sea-modules/jquery/1.9.1/jquery.min.js",
        "_" : "sea-modules/underscore/1.6.0/underscore-min.js",
        "bp" : "sea-modules/bootstrap3/bootstrap.js",
        "tp" : "sea-modules/artTemplate/template-native.js",
        "bp_switch" : "sea-modules/bootstrap-switch/bootstrap-switch.js",
        "auto" : "source/external/auto/typeahead.bundle.js",
        "zclip" : "source/external/zclip/jquery.zclip.js",
        "lock"  : "source/custom/util.js",
        "upload"   : "source/external/webuploader-0.1.5/webuploader.js",
        "chart"   : "source/external/chart/chart.min.js"
    },

    //设置目录
    paths :{
        service : ""
    },
    //更新时间戳
    'map': [
//        [ /^(.*\.(?:css|js))(.*)$/i, '$1?20110801' ]
    ],
    // 变量配置
    vars: {
        'locale': 'zh-cn'
    },

    //预先加载
    preload: ["$"],

    // 调试模式
    debug: false,

    // 文件编码
    charset: 'utf-8'
});

