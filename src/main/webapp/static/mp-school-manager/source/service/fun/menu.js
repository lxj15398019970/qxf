/**
 * 按钮配置js
 */

define(function(require, exports, module) {

	var lock = require("lock");
	var $ = window.$;
	
	/** 按钮最大个数 3 **/
	var maxMainMenu = "3";
	var maxSubMenu = "5";
	var menuDefName = "新建菜单";

	//主菜单 字数 <=4
	var maxMainFontSize = "4";

	var UI = {
		menuForm : $("#menu-form"),
		addMenu : $("#addMenu"),
		addSubMenu : $("#"),
		addMenuTempalte : $("#addMenuTemplate"),
		menuMain : $("#menu-main"),
		subMenuTempalte : $("#subMenuTempalte"),
		funTemplate : $("#functionListTemplate"),
		modelData : $("#modalData"),
		saveMenu : $("#saveMenu")
	};

	
	
	//验证判断
    var isComplete = $("#isComplete").val();
    if(isComplete == "0"){
    	lock.model.confirm("自定义菜单需要填写AppId和AppSecret，当前公众账号需先填写，是否现在去填写？",function(){
    		lock.WebPage.jumpPage("../user/add-open-input-01.shtml",0);
    	});
    }
	
	//添加主菜单
	UI.addMenu
			.click(function() {

				//判断当前个数
				var size = UI.menuMain.find("li.m-smenu").size();
				if (size >= maxMainMenu) {
					lock.alertMsg.error("错误", "一级按钮最大" + maxMainMenu + "个");
					return;
				}

				//渲染追加
				lock.WebPage.refreshTemplate(UI.menuMain, {},
						UI.addMenuTempalte, true);
				var newSize = size + 1;
				updateMainSize(newSize);

			});

	function updateMainSize(newSize) {
		//修改css样式
		if (newSize == "1") {

			UI.menuMain.removeClass("m-menu-2 m-menu-3 m-menu-4").addClass(
					"m-menu-1");
		} else if (newSize == "2") {

			UI.menuMain.removeClass("m-menu-3 m-menu-1 m-menu-4").addClass(
					"m-menu-2");
		} else if (newSize == "3") {

			UI.menuMain.removeClass("m-menu-2 m-menu-1 m-menu-4").addClass(
					"m-menu-3");
		}

	}

	//添加子菜单
	UI.menuMain.on("click", ".addSubMenu", function() {
		var $this = $(this);
		//判断当前个数
		var $p = $this.closest(".u-sub-main");
		var size = $p.find("[data-type='menu']").size();
		if (size >= maxSubMenu) {
			lock.alertMsg.error("错误", "二级按钮个数最大" + maxSubMenu + "个");
			return;
		}
		//渲染追加
		lock.WebPage.refreshTemplate($p, {}, UI.subMenuTempalte, true);

	});

	//选中菜单
	UI.menuMain.on("click", "[data-type='menu']", function() {
		//触发动画效果
		var $this = $(this);
		UI.menuMain.find('.z-current').removeClass('z-current');
		$this.addClass('z-current');
		/*
		 UI.menuMain.find("[data-type='menu']").parent().removeClass("z-current");
		 $this.parent().addClass("z-current");
		 UI.menuForm.find('.form-main').show();
		 */

		//是否主菜单
		if ($this.attr("data-main") == "1") {
			var dataObj = JSON.parse($this.attr("data-obj"));
			UI.menuMain.find(".u-sub-main").hide();
			$this.parent().find(".u-sub-main").show();
			var $menu = UI.menuForm.find("[name='menuName']");
			$menu.val($.trim($(this).text()));
			if(dataObj.eventType == ''){
				UI.menuForm.find('.form-main').hide();
			}else{
				UI.menuForm.find('.form-main').show();
			}
		}else{
			UI.menuForm.find('.form-main').show();
		}
			getSelected();
			if ($this.attr("data-obj")) {
				var dataObj = JSON.parse($this.attr("data-obj"));
				changeRightMenu(dataObj)
			} else {
				//新建 没有
				changeRightMenu();
			}
	});

	//文本框变化
	//ie 8下使用 onpropertychange

	UI.menuForm.find("[name='menuName']").on("input", function() {
		UI.menuForm.find('.form-main').show();
		var $selected = getSelected();
		var value = $.trim(this.value);
		//验证名称变化
		if (value == "") {
			$selected.$dom.html("");
			$selected.data.menuName = "";
			lock.alertMsg.info("提示", "请输入菜单名称");
			//return;
		} else if (value.length > maxMainFontSize) {
			lock.alertMsg.info("提示", "菜单名称最多" + maxMainFontSize + "个字");
            //截取4个字符
            value = this.value.substring(0,maxMainFontSize);
		}
		$selected.$dom.html(value);
		$selected.data.menuName = value;
		//保存模型
		saveData($selected.$dom, $selected.data);
	});

	//检测菜单
	//链接 功能切换
	UI.menuForm.find("[name='eventType']").click(function() {
		UI.menuForm.find('.form-main').show();
		var $this = $(this);
		var v = $this.val();
		var $link = $(".link");
		var $selectFun = $('#selectFun');
		if (v == "click") {
			$link.hide();
			$selectFun.show();
			$('.selectBtn').hide();
		} else if (v == "href") {
			$link.show();
			$selectFun.hide();
			if ($('.funName').text() == "") {
			$('.selectBtn').show();
			}

		}
	});

	//获得选中
	function getSelected() {
		var $a = UI.menuMain.find("a.z-current");
		//新建模型
		var obj = $a.attr("data-obj");
		if (!obj) {
			obj = {
				"menuName" : "",
				"id" : "",
				"eventType" : "",
				"href" : "",
				"content" : "",
				"objectId" : 0
			};
			$a.attr("data-obj", JSON.stringify(obj));
		} else {
			obj = JSON.parse(obj);
		}
		return {
			$dom : $a,
			data : obj
		};
	}

	function saveData($dom, data) {
		$dom.attr("data-obj", JSON.stringify(data));
	}

	//

	//重置右侧
	function changeRightMenu(data) {
		var $menu = UI.menuForm.find("[name='menuName']");
		var $eventType = UI.menuForm.find("[name='eventType']");
		var $href = UI.menuForm.find("[name='href']");
		var funName = $("#funName");
		if (!data) {
			$menu.val("");
			$href.val("");
			$eventType[0].click();
		} else {
			$menu.val(data.menuName);
			//链接与功能
			if (data.eventType == "href") {
				funName.html("");
				$href.val(data.href);
				$eventType.eq(1).click();
			} else if (data.eventType == "click") {
				funName.html(data.functionName);
				funName.show();
				$href.val("");
				$eventType.eq(0).click();
				
			}
		}
	}

	//删除菜单
	UI.menuMain.on("click", ".close", function() {
		var $this = $(this);
		var $dp = $this.parent().find("[data-type='menu']");
		//是否主菜单
		if ($dp.attr("data-main") == "1") {
			//判断当前个数
			var size = UI.menuMain.find("li.m-smenu").size();
			var newSize = size - 1;
			updateMainSize(newSize);
		}
		$dp.parent().remove();
	});

	//功能按钮
	$("#selectFun").on("click", function() {
		//查询功能列表
		Ajax.getFunList();
		$('.selectBtn').hide();
	});

	//选择功能
	UI.modelData.find(".modal-body").on("click", ".funList li a", function() {
		var $this = $(this);
		var id = $this.attr("data-id");
		var name = $this.html();
		var funName = $("#funName");
		funName.html(name);
		funName.show();
		$("[name = 'functionId']").val(id);
		UI.modelData.modal("hide");
		var $selected = getSelected();
		$selected.data.objectId = id;
		$selected.data.eventType = "click";
		$selected.data.href = "";
		$selected.data.functionName = name;
		saveData($selected.$dom, $selected.data);
	});

	// 链接配置
	$('#linksBtn').on('click', function() {
		var $this = $(this);
		var links = $this.parents('.link').find('[name="href"]').val();
		var $selected = getSelected();
		$selected.data.href = links;
		$selected.data.eventType = "href";
		$selected.data.objectId = 0;
		saveData($selected.$dom, $selected.data);
		lock.alertMsg.success("确定", "设置成功");
	});

	var Ajax = {
		URL : {
			menuList : "../fun/getFunctions"
		},
		//获得功能列表
		getFunList : function() {
			lock.AjaxUtil.get(Ajax.URL.menuList, {}, function(result) {
				var data = {
					list : result
				};
				lock.model.templateModel("选择功能", data, UI.funTemplate, true);
			}, lock.AjaxError);
		}

	};
	// 保存配置
	UI.saveMenu.on("click", function() {
		var str = "";
		$("#dataInput").attr("dataBox", "");
		//遍历一级菜单
		str += "[\r\n";
		var menuA = UI.menuMain.find('[data-main="1"]');
		var pos =0;
		
		menuA.each(function(i) {
			var $this = $(this);
			var menuId = $this.attr('menu-id');
            var data = $(this).attr('data-obj');
            var jsonData = eval('(' + data + ')');
			str += "{";
			str += '"id": ' + menuId + ',' + '"menuName": "'+ $.trim($this.text())+'",' + '"eventType": "' + jsonData.eventType + '",'+ '"href": "' + jsonData.href + '",'+'"objectId": ' + jsonData.objectId + ','+
					'"twoMenus": [\r\n';
			var menuList = $this.parent(i).find('[data-main="2"]');
			var fname = $.trim($this.text());
			if(fname == '' || fname == '新建菜单'){
                lock.alertMsg.error("警告", "一级菜单名字不能为空或者是默认值(新建菜单)");
				pos = 1;
				return false;
			}
			
			if(jsonData.eventType != "" &&  menuList.size() >0 ){
                lock.alertMsg.error("错误", "如果设置一级菜单事件,则不能添加二级菜单！");
				pos = 1;
				return false;
			}

            if(jsonData.eventType == "" && (menuList.size() < 2 || menuList.size() >5)){
                lock.alertMsg.error("错误", "二级菜单数组，个数应为2~5个");
                pos = 1;
                return false;
            }
			
			menuList.each(function() {

				var data = $(this).attr('data-obj');
			
				var jsonData = eval('(' + data + ')');
				
				if(jsonData.menuName == ''){
                    lock.alertMsg.error("错误", "二级菜单名字不能为空或者是默认值(新建菜单)");
					pos = 1;
					return false;
				}
				
				if(jsonData.objectId == '' && jsonData.eventType == ''){
                    lock.alertMsg.error("错误", "二级菜单"+jsonData.menuName+"没有事件，请选择");
					pos = 1;
					return false;
				}

				str += '{' +
				//                        '"content": "'+jsonData.content+'",'+
				'"eventType": "' + jsonData.eventType + '",' + '"objectId": '
						+ jsonData.objectId + ',' + '"href": "'
						+ jsonData.href + '",' + '"id": ' + 1 + ','
						+ '"menuName": "' + jsonData.menuName + '"' + '},\r\n';

			});
			str = str.substring(0, str.lastIndexOf(","));
			str += '],\r\n"userId":0';
			str += '}\r\n,';

		});



		str = str.substring(0, str.lastIndexOf(","));
		str += "]";
		$("#dataInput").attr("dataBox", str);
		if(pos == 1){
			return false;
		}
		
		$.ajax({
			type : 'post',
			url : "../fun/menu-add.shtml",
			data : {
				menus : str
			},
			dataType : 'json',
			success : function(result) {
                lock.alertMsg.success("成功", "修改成功！");
                lock.WebPage.reloadPage(1200);
			},
			error : function(data) {
                lock.alertMsg.error("错误", "保存失败");
			}
		})

	});

});
