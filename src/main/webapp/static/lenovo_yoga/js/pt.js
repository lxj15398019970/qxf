$(function(){




var puzzle = {};
puzzle.rank = "";// 难度，从页面中获取
puzzle.myTime = "";// 时间驱动变量
puzzle.allTime = "";// 本次玩游戏的总时间
puzzle.step = 0;// 本次玩游戏的总步骤
puzzle.flag = "";// 游戏的标志 1为游戏中；2为暂停；其他为非游戏状态
puzzle.blankSite = "";// 存储当前空模块的位置
puzzle.init = function(){
    puzzle.rank = parseInt(3);
    puzzle.setHTML();
};
puzzle.setHTML = function(){
    var elem = cn.g("photo");
    var blankTag = document.createElement("li");// 单独创建空白碎片
    var liSize = Math.floor(340/puzzle.rank);// 计算单个碎片的大小/宽高
    var widthAll = (liSize + 4) * puzzle.rank// 计算容器总宽
    cn.addClass(blankTag, "mark");
    blankTag.setAttribute("name", puzzle.rank*puzzle.rank-1);
    blankTag.id = "blank";
    blankTag.innerHTML = '<span class="top"></span><span class="right"></span><span class="bottom"></span><span class="left"></span><strong>GO</strong>';
    cn.setStyle(blankTag, {width:liSize+"px", height:liSize+"px"});
    cn.setStyle(elem, {width:widthAll+"px"});

    elem.innerHTML = "";
    for(var i=0; i<(puzzle.rank*puzzle.rank-1); i++){
        var photoTag = document.createElement("li");
        var _left = 0, _top = 0;

        _left = - liSize * (i % puzzle.rank);
        _top = - liSize * Math.floor(i / puzzle.rank);

        cn.setStyle(photoTag, {width:liSize+"px", height:liSize+"px", backgroundPosition:_left+"px "+_top+"px"});
        photoTag.setAttribute("name", i);

        elem.appendChild(photoTag);
    }

    elem.appendChild(blankTag);
};
puzzle.playLoading = function(){
    // 暂停时再开始的处理
    if(parseInt(puzzle.allTime) > 0){
        puzzle.stopPlay();
        return false;
    }

    var elem = cn.g("photo");
    var count = 3;
    var loading = document.createElement("div");
    var loadingBg = document.createElement("div");
    var loadingText = document.createElement("p");
    var text = document.createTextNode("预览倒计时");
    var countTag = document.createElement("em");
    var loadTime;
    cn.addClass(loading, "loading");
    cn.addClass(loadingBg, "loadingBg");
    cn.addClass(loadingText, "loadingText");

    cn.setStyle(loading, {width:cn.getStyle(elem, "width"), height:elem.scrollHeight +"px"});
    cn.setStyle(loadingBg, {width:cn.getStyle(elem, "width"), height:elem.scrollHeight +"px"});
    cn.setStyle(loadingText, {width:cn.getStyle(elem, "width")});

    loadingText.appendChild(text);
    loadingText.appendChild(countTag);
    loading.appendChild(loadingBg);
    loading.appendChild(loadingText);
    elem.appendChild(loading);

    // 清空页面残留数据 为开始做准备
    cn.g("myTime").innerHTML = "0";
    cn.g("step").innerHTML = "0";

    // 倒计时开始
    countTag.innerHTML = count;
    loadTime = setInterval(t, 1000);
    function t(){
        if(count == 0){
            clearInterval(loadTime);
            loading.parentNode.removeChild(loading);
            puzzle.start();
            return false;
        }
        count = count-1;
        countTag.innerHTML = count;
    };
};
puzzle.start = function(){
    puzzle.flag = 1;
    puzzle.timeNote();
    cn.hide(cn.g("playBUt"));
    cn.show(cn.g("stopBUt"));

    puzzle.random();// 随机排列
    puzzle.setBlankModule();// 设置空模块的相关属性
    puzzle.addevent();// 添加游戏的事件
    //alert("开始玩喽！");
};
puzzle.timeNote = function(){
    puzzle.myTime = setInterval(t, 1000);
    function t(){
        var text;
        puzzle.allTime++;
        if(puzzle.allTime/60 >= 1){
            text = puzzle.allTime;
        }else{
            text = puzzle.allTime;
        }
        cn.g("myTime").innerHTML = text;
    };
};
puzzle.stepNote = function(){

};
puzzle.reset = function(){
    if(puzzle.step != 0){// 检测是否有成绩
        if(!confirm("您确定要放弃现在的成绩吗？")) return false;
    }
    clearInterval(puzzle.myTime);// 停止计时器
    puzzle.allTime = 0;// 清空已经存在的时间
    puzzle.step = 0;// 清空已经存在的时间
    puzzle.flag = 0;// 回复非玩状态
    puzzle.init();
    puzzle.playLoading();
};
puzzle.stop = function(){
    clearInterval(puzzle.myTime);
    puzzle.flag = 2;
    cn.show(cn.g("playBUt"));
    cn.hide(cn.g("stopBUt"));

    var elem = cn.g("photo");
    var loading = document.createElement("div");
    var loadingBg = document.createElement("div");
    var loadingText = document.createElement("p");
    var text = document.createTextNode("游戏暂停！ 请点击上方按钮开始。");
    cn.addClass(loading, "loading");
    cn.addClass(loadingBg, "loadingBg");
    cn.addClass(loadingText, "loadingText");

    cn.setStyle(loading, {width:cn.getStyle(elem, "width"), height:elem.scrollHeight +"px"});
    cn.setStyle(loadingBg, {width:cn.getStyle(elem, "width"), height:elem.scrollHeight +"px"});
    cn.setStyle(loadingText, {width:cn.getStyle(elem, "width")});

    loadingText.appendChild(text);
    loading.appendChild(loadingBg);
    loading.appendChild(loadingText);
    elem.appendChild(loading);

};
puzzle.stopPlay = function(){// 暂停后再开始
    puzzle.timeNote();
    cn.hide(cn.g("playBUt"));
    cn.show(cn.g("stopBUt"));

    var stopTag = cn.g("photo").getElementsByTagName("div")[0];
    stopTag.parentNode.removeChild(stopTag);// 移除暂停注释节点
};
puzzle.random = function(){// 使当前图片碎片随机排列
    var elem = cn.g("photo");
    var photoArray = [];
    var _li = elem.getElementsByTagName("li");
    cn.each(_li, function(i, v){
        photoArray.push(v);
    });

    photoArray.sort(function(){// 随机排序
        //alert(photoArray)
        return 0.5 - Math.random();
    });

    //alert(elem.innerHTML)
    //elem.innerHTML = " ";
    elem.innerHTML="";
    cn.each(photoArray, function(i, v){// 写入随机后的内容
        //alert(i)
        v.setAttribute("random-sort", i);
        elem.appendChild(v);

    });
};
puzzle.addevent = function(){// 添加游戏的事件
    var elem = cn.g("photo");
    var _li = elem.getElementsByTagName("li");
    var arrows = cn.g("blank").getElementsByTagName("span");

    // 注册点击临近模块事件
    cn.each(_li, function(i, v){
        if(v.className.indexOf("mark") == -1){
            cn.on(v, "click", function(){
                puzzle.moduleClick(v);
            });
        }
    });

    // 注册上下左右键头事件
    cn.on(arrows[0], "click", function(){ puzzle.exchange(puzzle.blankSite - puzzle.rank) });
    cn.on(arrows[1], "click", function(){ puzzle.exchange(puzzle.blankSite + 1) });
    cn.on(arrows[2], "click", function(){ puzzle.exchange(puzzle.blankSite + puzzle.rank) });
    cn.on(arrows[3], "click", function(){ puzzle.exchange(puzzle.blankSite - 1) });

    // 注册键盘事件
    //cn.on(document, "keydown", puzzle.keyDown);
//        document.onkeydown = function(){
//            puzzle.keyDown();
//            return false;
//        };


};
puzzle.keyDown = function(){// 注册键盘事件
    var arrows = cn.g("blank").getElementsByTagName("span");
    var keyValue = cn.getEvent().keyCode;

    if(keyValue == 38){//上
        if(cn.getStyle(arrows[2], "display") != "none") puzzle.exchange(puzzle.blankSite + puzzle.rank);
    }else if(keyValue == 39){//右
        if(cn.getStyle(arrows[3], "display") != "none") puzzle.exchange(puzzle.blankSite - 1);
    }else if(keyValue == 40){//下
        if(cn.getStyle(arrows[0], "display") != "none") puzzle.exchange(puzzle.blankSite - puzzle.rank);
    }else if(keyValue == 37){//左
        if(cn.getStyle(arrows[1], "display") != "none") puzzle.exchange(puzzle.blankSite + 1);
    }
};
puzzle.moduleClick = function(elem){
    var count = elem.getAttribute("random-sort");

    if((puzzle.blankSite-1) == count || (puzzle.blankSite+1) == count || (puzzle.blankSite-puzzle.rank) == count || (puzzle.blankSite+puzzle.rank) == count){
        puzzle.exchange(count);
    }
};
puzzle.setBlankModule = function(){// 设置空模块的相关属性； 空模块的当前位置 空模块的现实状态
    //alert("a");
    var elem = cn.g("photo");
    var _li = elem.getElementsByTagName("li");
    var blankElem;
    var arrows;
    cn.each(_li, function(i, v){
        if(v.className.indexOf("mark") > 0){
            puzzle.blankSite = i;
            blankElem = v;
        }
    });

    arrows = blankElem.getElementsByTagName("span");
    cn.each(arrows, function(i, v){
        cn.show(v);
    });
    // 选择性的隐藏箭头
    if(puzzle.blankSite < puzzle.rank) cn.hide(arrows[0]);// 最上排筛选
    if((puzzle.blankSite%puzzle.rank) == 0) cn.hide(arrows[3]);// 最左侧一列
    if((puzzle.blankSite%puzzle.rank) == (puzzle.rank-1)) cn.hide(arrows[1]);// 最右侧一列
    if(puzzle.blankSite >= puzzle.rank*puzzle.rank-puzzle.rank) cn.hide(arrows[2]);// 最下排筛选

    // 顺便设置一下当前步骤记录
    cn.g("step").innerHTML = puzzle.step;
};
puzzle.exchange = function(count){// 交换节点，处理处触发动作后空节点和真实节点的交换
    var elem = cn.g("photo");
    var _li = elem.getElementsByTagName("li");
    var clickElem = _li[count], blankElem = _li[puzzle.blankSite], referenced;

    if(count == puzzle.blankSite-1) elem.insertBefore(blankElem, clickElem);// 点击在空白模块之前
    if(count == puzzle.blankSite+1) elem.insertBefore(clickElem, blankElem);// 点击在空白模块之后
    if(count == puzzle.blankSite-puzzle.rank){// 点击在空白模块之上
        elem.insertBefore(blankElem, clickElem);
        if(puzzle.blankSite != puzzle.rank*puzzle.rank-1){
            elem.insertBefore(clickElem, _li[puzzle.blankSite+1]);
        }else{
            elem.appendChild(clickElem);
        }
    }
    if(count == puzzle.blankSite+puzzle.rank){// 点击在空白模块之下
        elem.insertBefore(blankElem, clickElem);
        elem.insertBefore(clickElem, _li[puzzle.blankSite]);
    }

    puzzle.isOk();// 检测是否完成
};
puzzle.isOk = function(){// 检测是否完成
    var elem = cn.g("photo");
    var _li = elem.getElementsByTagName("li");
    var result = true;

    cn.each(_li, function(i, v){// 写入随机后的内容
        //alert(i)
        v.setAttribute("random-sort", i);
    });

    // 记录操作的步骤
    puzzle.step++;

    // 重新设置空模块属性
    puzzle.setBlankModule();


    // 检查是否完成
    cn.each(_li, function(i, v){// 写入随机后的内容
        //alert(i)
        if(v.getAttribute("name") != i) result = false;
    });
    if(result) puzzle.finish();
};
puzzle.finish = function(){// 完成后

    clearInterval(puzzle.myTime);// 停止计时器
    cn.hide(cn.g("playBUt"));
    cn.hide(cn.g("stopBUt"));
    cn.hide(cn.g("resetBut"));
    cn.show(cn.g("replayBut"));
    //alert("真心的恭喜您！ 成功啦！");

    cn.show(cn.g("phoneSubLayer"));
    cn.show(cn.g("tra-layer"));


//        var elem = cn.g("photo");
//        var loading = document.createElement("div");
//        var loadingBg = document.createElement("div");
//        var loadingText = document.createElement("p");
//        var loadingSpan = document.createElement("span");
//        var text = document.createTextNode("恭喜您！ 成功啦！");


//        cn.addClass(loading, "loading");
//        cn.addClass(loadingBg, "loadingBg");
//        cn.addClass(loadingText, "loadingText");
//        cn.addClass(loadingSpan, "succeed");
//
//        cn.setStyle(loading, {width:cn.getStyle(elem, "width"), height:elem.scrollHeight +"px"});
//        cn.setStyle(loadingBg, {width:cn.getStyle(elem, "width"), height:elem.scrollHeight +"px"});
//        cn.setStyle(loadingText, {width:cn.getStyle(elem, "width")});
//
//        loadingSpan.appendChild(text);
//        loadingText.appendChild(loadingSpan);
//        loading.appendChild(loadingBg);
//        loading.appendChild(loadingText);
//        elem.appendChild(loading);
};

cn.on(window, "load", function(){
    // 检测浏览器
//        if(!((cn.firefox && parseInt(cn.firefox) >= 4) || (cn.chrome && parseInt(cn.chrome) >= 11))){
//            cn.g("gameBox").innerHTML = '<p style="line-height:50px; color:#fff; font-size:14px;">对不起，本游戏仅支持<strong style="font-weight:bold;">FireFox4.0</strong>[及以上版本] 和 <strong style="font-weight:bold;">Chrome11</strong>[及以上版本]</p>';
//            return false;
//        }

    puzzle.init();
    cn.on(cn.g("playBUt"), "click", function(){
        puzzle.playLoading();
    });
    cn.on(cn.g("stopBUt"), "click", function(){
        puzzle.stop();
    });
    cn.on(cn.g("resetBut"), "click", function(){
        puzzle.reset();
    });
    cn.on(cn.g("replayBut"), "click", function(){
        location.reload();
    });

    cn.on(cn.g("rank"), "change", function(){
        puzzle.reset();
    });

});

})