/**
 * 关注自动回复js
 */
	

define(function(require, exports, module) {

	// 引入依赖
	var $ = window.$;
	var lock = require("lock");
	require("upload")();
	
	var BaseEmoj = [];
	var UI = {
		error : $("#error"),
		replyTab : $("#replyTab"),
		preview : $(".emotions_preview"),
		emAction : $("#emotionAction"),
		emAction2 : $("#messageReply  .emotionAction"),
		emContent : $(".emotion_wrp"),
		emContent2 : $("#messageReply  .emotion_wrp"),
		emTx : $("#editor-textarea"),
		fontLess : $("#fontLess"),
		cliHref : $(".clib-href"),
		messageContent : $("#messageContent"),
		peiliao : $("#peiliao"),
		keyWorld : $("#keyWorld"),
		keyWorldModel : $("#addKeyListModel"),
		seTh : $("#selectToggle"),
		subKeyBtn : $("#subKeyBtn"),
		keyListTemplate : $("#keyListTempalte"),
		keyList		    :  $("#setting-table tbody"),
		swfImg     :     $("#swfup-img"),
		newListTemplate : $("#newListTemplate"),
		newList    : $("#new-list-all"),
		newsBtn    : $("#newsBtn")
	};

	var FONT_MAX = 600;
	UI.fontLess.html(FONT_MAX);

	UI.seTh.change(function() {
		var $this = $(this);
		var otherDom = $("#" + this.value).show().siblings();
		UI.subKeyBtn.attr("key", this.value);
		otherDom.hide();
	});

	function resetKeyData() {
		$("#ruleName").val("");
		$("#ruleKeyWord").val("");
		ue_03.html("");
		UI.newList.html("");
		newLayerId = 0;
	}

	
	
	

	// 改变ueid

	var editor01 = $("[name='editorContent']")[0];
	var editor02 = $("[name='editorContent']")[1];
	var editor03 = $("[name='editorContent']")[2];

	editor01.id = "editor01";
	editor02.id = "editor02";
	editor03.id = "editor03"

	var options = {
		items : "",
		afterChange : function() {
		}
	};
	var ue_01 = KindEditor.create('#editor01', options);
	var ue_02 = KindEditor.create('#editor02', options);
	var ue_03 = KindEditor.create('#editor03', options);

	var ue = ue_01;
	
	var  newLayerId = 0 ;
	
	// ue编辑器
	function insertHtml(value) {
		ue.html(ue.html() + value);
	}
	function getContent() {
		return ue.html();
	}
	var EventInit = function() {
		// 初始化数据
		Ajax.getSubData();
		Ajax.getMessageData();
		Ajax.getKeyList();
			
		
		
		//绑定添加
		UI.newsBtn.on("click",function(){
			if((newLayerId+1) > "10" ){
				lock.alertMsg.error("失败", "最多添加10条图文消息！");
			}
			else{
				createSwfUpload();
			}
		});
		
		UI.newList.on("click",".clsoe-new-layer",function(){
			var dom = $(this).closest(".news-list");
			removeSwfUpload(dom);
		});
		
		
		function toggleKeySub(type, obj) {
			if (type == "update") {
				UI.keyWorldModel.find(".modal-title").html("更新关键字");
				UI.keyWorldModel.find("#ruleName").val(obj.ruleName);
				UI.keyWorldModel.find("#ruleKeyWord").val(obj.keys);
				UI.keyWorldModel.find("[name='data-id']").val(obj.id);
				
				
				if (obj.msgType == "文本") {
					$("#selectToggle").find("option[value='fontType']").prop(
							"selected", true);
				} else if (obj.msgType == "图文") {
					$("#selectToggle").find("option[value='picFontType']")
							.prop("selected", true);
					
				}
				UI.seTh.trigger("change");
				
				//发下replys 图文消息
				if(obj.replys){
					
					UI.newList.html("");
					
					//创建webup
					for(var j=0;j<obj.replys.length;j++){
						createSwfUpload(true,obj.replys.image);
						//创建img
					}
					
					//赋值webup
					UI.newList.find(".news-list").each(function(i){
						
                       						
						var dom  = $(this);
						var rp = obj.replys[i];
					     
						
						
						var title = dom.find("[name='news-title']").val(rp.title);
						var content = dom.find("[name='news-content']").val(rp.content);
						var img    = dom.find(".news-img").attr("src",rp.image);
						
						if(rp.image == null || rp.image == ''){
							dom.find(".news-img").parent().remove();
						}
						
						var href = dom.find("[name='news-href']").val(rp.href);
					});
					
				}
				else{
					ue_03.html(obj.content);
				}
				
				UI.subKeyBtn.attr("op","update");
				
			} else {
				UI.keyWorldModel.find("[name='data-id']").val("");
				resetKeyData();
				UI.subKeyBtn.attr("op","add");
				UI.keyWorldModel.find(".modal-title").html("添加关键字");
			}	

			UI.keyWorldModel.modal("show");
			
			
		}
		
		

		// 编辑删除
		$("#setting-table").on("click", ".updateKey", function() {
			var $this = $(this);
			var tr = $this.closest("tr");
			var id = tr.attr("data-id");
			var ruleName = tr.find(".t-ruleName").html();
			var keys = tr.find(".t-keys").html();
			var msgType = tr.find(".t-msgType").html();
			var content = tr.find("[name='content']").val();
			content = parseHtmlEmo(content);
			var obj = {
				id : id,
				ruleName : ruleName,
				keys : keys,
				msgType : msgType,
				content : content
			};
			
			
			
			//加载getreplays
			if(msgType == "图文"){
				$this.hide();
				$this.prev().show();
				
				Ajax.getReplys(id,function(result){
					obj.replys = result.items;
					// 打开弹窗
					toggleKeySub("update", obj);
					
					$this.show();
					$this.prev().hide();
				});
			}
			else{
				// 打开弹窗
				toggleKeySub("update", obj);
			}
			
			
			
		});

		$("#setting-table").on("click", ".deleteKey", function() {
			var $this = $(this);
			var tr = $this.closest("tr");
			var id = tr.attr("data-id");
			 lock.model.confirm("确定删除此规则吗?",function(){
				 	Ajax.deleteKey(id);
		        });
			 
			 return false;
		});

		// 陪聊
		UI.peiliao.click(function() {
			if (this.checked == true) {
				Ajax.robotStatus(1, function() {
					UI.messageContent.hide();
				});

			} else {
				Ajax.robotStatus(0, function() {
					UI.messageContent.show();
				});
			}
		});

		// 菜单一级选显卡
		UI.replyTab.on("click", "a", function(e) {
			e.preventDefault();
			var type = $(this).parent().attr("type");
			// editor
			if (type == "messageReply") {
				ue = ue_02
			} else if (type == "subscribeReply") {
				ue = ue_01
			} else if (type == "keyReply") {
				ue = ue_03
			}
			$(this).tab('show');
		});

		// 关键字点击
		UI.keyWorld.click(function() {
			// 打开弹窗
			toggleKeySub("add");
			
			UI.keyWorldModel.modal("show");
		});

		// 表情
		$(".emotions").on("mouseenter", ".emotions_item", function() {
			var $this = $(this);
			var url = $this.find("i").attr("data-gifurl");
			var img = "<img src='" + url + "'/>"
			UI.preview.html(img);
		});

		// 点击表情累加
		$(".emotions").on("click", ".emotions_item", function() {
			var $this = $(this);
			var char = $this.find("i").attr("char");
			var url = $this.find("i").attr("data-gifurl");

			var img = "<img src=\"" + url + "\"/>";
			insertHtml(img);
		});

		// 点击出现表情
		$(".emotionAction").click(function() {
			var status = $(this).attr("status");
			if (status == "1") {

				UI.emContent.fadeOut();
				status = 0;
			} else {

				UI.emContent.fadeIn();
				status = 1;
			}
			$(this).attr("status", status);
		});

		// 鼠标点击其他地方隐藏
		$(document).click(
				function(e) {
					var $tg = $(e.target);
					if ($tg.closest(".emotion_wrp").length <= 0
							&& $tg.attr("id") != "emotionAction") {
						UI.emAction.attr("status", "0");
						UI.emContent.fadeOut();
					}
				});

		// 字数限制
		UI.emTx.on("input", function() {
			var vh = $(this).val();
			var lh = vh.length;
			if (lh < FONT_MAX) {
				UI.fontLess.html(FONT_MAX - lh);
			} else {
				UI.fontLess.html(0);
				UI.emTx.val(vh.substring(0, FONT_MAX));
			}
		});

		$("#cancelKeyBtn").click(function() {
			resetKeyData();
		});

		// 插入链接
		UI.cliHref.click(function() {
			var hml = $("#addHref").html();
			$("#modalData").find(".modal-body").html(hml);
			$("#modalData").modal("show");
			return false;

		});

		// 保存链接
		$("#modalData").find(".btn-success").click(saveHref);
		function saveHref(_this) {
			var $form = $("#modalData").find("form");
			var name = $form.find("[name='hrefName']").val().trim();
			var url = $form.find("[name='hrefUrl']").val().trim();
			if (name == "" || url == "") {
				lock.alertMsg.error("提示", "名称 和 地址 不能为空");
				return;
			}
			if(url.indexOf("http://") < 0){
				lock.alertMsg.error("提示", "请输入合法的url地址");
				return;
			}
			var a = "<a href=\"" + url + "\">" + name + "</a> ";
			insertHtml(a);
			$("#modalData").modal("hide");

		}
		
		// 上传文件参数
		var uploadParam = {
				 // 选完文件后，是否自动上传。
			    auto: true,

			    // swf文件路径
			    swf: '../static/mp-school-manager/source/external/swfupload/swfupload.swf',

			    // 文件接收服务端。
			    server: 'file-upload.shtml',

			    // 选择文件的按钮。可选。
			    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
			    pick: '#filePicker',

			    // 只允许选择图片文件。
			    accept: {
			        title: 'Images',
			        extensions: 'gif,jpg,jpeg,bmp,png',
			        mimeTypes: 'image/*'
			    },
			    compress: false,
			    
			    fileNumLimit : 1,
			    fileSizeLimit : 1024*1024 * 3
		};
		
		
		var thumbnailWidth,thumbnailHeight = 100;

		
		// 创建文件上传
		function createSwfUpload(isEdit){
			newLayerId++;
			
			lock.WebPage.refreshTemplate(UI.newList, {id:"wup-"+newLayerId,btn:"wup-"+newLayerId+"-btn",list : "wup-"+newLayerId+"-list"},UI.newListTemplate,true);
			
			//链接地址配置上http
			
			var $dom = $("#wup-"+newLayerId);
			var $btn = $dom.find("#wup-"+newLayerId+"-btn");
			var  $list= $dom.find("#wup-"+newLayerId+"-list");
			var param = $.extend({},uploadParam,{pick:"#wup-"+newLayerId+"-btn"});
				
			if(isEdit){
				  var $li = $(
				            '<div class="file-item thumbnail">'+
				                '<img class="news-img">' +
				                '<div class="info"> </div>' + '<span class="wu-close">X</span>'+
				            '</div>'
				            ),
				        $img = $li.find('img');
				  
				    // $list为容器jQuery实例
				    $list.html( $li );
				    $li.one('click', '.wu-close', function() {
					    $li.remove();
					})
			}	
			
				
			var uploader = WebUploader.create(param);
			
			uploader.option('compress', {
			    width: 350,
			    height: 320
			});

			// 当有文件添加进来的时候
			uploader.on( 'fileQueued', function( file ) {

			    var $li = $(
			            '<div id="' + file.id + '" class="file-item thumbnail">'+
			                '<img class="news-img">' +
			                '<div class="info">' + file.name + '</div>' + '<span class="wu-close">X</span>'+
			            '</div>'
			            ),
			        $img = $li.find('img');
			    // $list为容器jQuery实例
			    $list.html( $li );
			    
			    
			    $li.one('click', '.wu-close', function() {
				    uploader.removeFile( file );
				    $li.remove();
				})
			});
			
			
			// 文件上传过程中创建进度条实时显示。
			uploader.on( 'uploadProgress', function( file, percentage ) {
			    var $li = $( '#'+file.id ),
			        $percent = $li.find('.progress span');

			    // 避免重复创建
			    if ( !$percent.length ) {
			        $percent = $('<p class="progress"><span></span></p>')
			                .appendTo( $li )
			                .find('span');
			    }

			    $percent.css( 'width', percentage * 100 + '%' );
			});

			// 文件上传成功，给item添加成功class, 用样式标记上传成功。
			uploader.on( 'uploadSuccess', function( file,result ) {
			    $( '#'+file.id ).addClass('upload-state-done');
			    var $img  = $( '#'+file.id ).closest(".uploader-list").find("img");
			    $img.attr("src",result);
			});
			
			// 文件上传失败，显示上传出错。
			uploader.on( 'uploadError', function( file ) {
			    var $li = $( '#'+file.id ),
			        $error = $li.find('div.error');

			    // 避免重复创建
			    if ( !$error.length ) {
			        $error = $('<div class="error"></div>').appendTo( $li );
			    }

			    $error.text('上传失败');
			});

			// 完成上传完了，成功或者失败，先删除进度条。
			uploader.on( 'uploadComplete', function( file ) {
			    $( '#'+file.id ).find('.progress').remove();
			});
			
			uploader.on( 'error', function( message ) {
					if(message == "Q_EXCEED_SIZE"){
						lock.alertMsg.error("错误","文件大小超过限制");
					}
					else if(message == "Q_EXCEED_NUM_LIMIT"){
						lock.alertMsg.error("错误","最多只能上传一张图片！");
					}
					else{
						lock.alertMsg.error("错误",message);
					}
			});
			
			
			
	}
			
		
			
		// 删除文件上传
		function removeSwfUpload($dom){
			$dom.remove();
			newLayerId--;
		}
		


		// 保存关注回复
		$("#btnSaveSubic").click(function() {
			var content = ue_01.html();
			Ajax.postSubData(content);

		});

		// 保存消息自动回复
		$("#btnSaveMessage").click(function() {
			var content = ue_02.html();
			Ajax.postMessage(content);

		});
		function foreachDom(){
			var array =[];
			var obj = {};
			var isFlag = true;
			
			
			var result = UI.newList.find(".news-list").each(function(i){
				var $this = $(this);
				var title = $this.find("[name='news-title']").val();
				var content = $this.find("[name='news-content']").val();
				var img    = 	$this.find(".news-img").attr("src");
				var href   =  $this.find("[name='news-href']").val();
				
				if(lock.JString.isEmpty(title)){
					lock.alertMsg.error("失败", "请输入标题！");
					isFlag = false;
					return  false;
				}
				else if(lock.JString.isEmpty(content)){
					lock.alertMsg.error("失败", "请输入内容!");
					isFlag = false;
					return false;
				}
				
					 var temp = {
								image : img,
								title : title,
								content : content,
								href  : href
						};
						array.push(temp);
			});
			
			
			if(isFlag){
				return array;
			}
			else{
				return false;
			}
			
			
		}
		UI.subKeyBtn.click(function() {
			var $this = $(this);
			var op= $this.attr("op");
			var id;
			var replys;
			var rName = $("#ruleName").val().trim();
			var ruleKeyWord = $("#ruleKeyWord").val().trim();
		
			var ruleContent = ue_03.html();
			var type = $this.attr("key");
			
			if (rName == null || rName == '') {
				lock.alertMsg.error("失败", "规则名称不能为空！");
				return false;
			}
			
			if (ruleKeyWord == null || ruleKeyWord == '') {
				lock.alertMsg.error("失败", "关键字列表不能为空");
				return false;
			}
			
			
			if (rName.length > 20) {
				lock.alertMsg.error("失败", "规则名称长度不能超过20个字符！");
				return false;
			}
			
			if (ruleKeyWord.length > 20) {
				lock.alertMsg.error("失败", "关键字长度不能超过20个字符");
				return false;
			}
			
			
			if (type == "fontType") {
				type = "text"
					if (ruleContent == null || ruleContent == '') {
						lock.alertMsg.error("失败", "内容不能为空！");
						return false;
					}
					
					if(op == "update"){
						id = UI.keyWorldModel.find("[name='data-id']").val();
					}
					
					Ajax.postKey(id,rName, ruleContent, ruleKeyWord, type);
					
			} else if (type == "picFontType") {
				type = "news";
				var replys = foreachDom();
				ruleContent = undefined;
				if(replys == false){
					return false;
				}
				
				id = UI.keyWorldModel.find("[name='data-id']").val();
				Ajax.postNews(id,rName,ruleKeyWord,replys);
			}
			
		});
	}
	
	

	String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
		if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
			var reg = new RegExp(reallyDo, (ignoreCase ? "gi" : "g"));
			return this.replace(reg, replaceWith);
		} else {
			return this.replace(reallyDo, replaceWith);
		}
	}

	// 解析html表情
	function parseHtmlEmo(content) {
		if (content != null && content != "") {
			var temp;
			for (var i = 0; i < BaseEmoj.length; i++) {
				var emj = BaseEmoj[i];
				var img = "<img src=\"" + emj.gifUrl + "\"/>";
				while (content.indexOf(emj.char) > -1) {
					content = content.replace(emj.char,img);
				}
			}
		} else {
			content = "";
		}

		return content;
	}
	// 编译html表情
	function stringToHtmlEmo(content) {
		if (content != null && content != "") {
			var temp;
			for (var i = 0; i < BaseEmoj.length; i++) {
				var emj = BaseEmoj[i];
				var gifUrl = emj.gifUrl;
				gifUrl = gifUrl.substring(gifUrl.lastIndexOf("/")+1)
				var img = "<img src=\"" + emj.gifUrl + "\" />";
				while (content.indexOf(gifUrl) > -1) {
					content = content.replace(img, emj.char);
				}
			}
			content = content.replace(/<br \/>/g, "");
			content = content.replace(/<p*>/g, "");
			content = content.replace(/<\/p>/g, "");
			content = content.replace(/<*span*>/g, "");
			content = content.replace(/&nbsp;/g, "");
		} else {
			content = "";
		}

		return content;
	}

	var Ajax = {
		URL : {
			emoj : "../static/mp-school-manager/json/emoji.js",
			sub : "./get-subscribe-reply.shtml",
			message : "./get-message-reply.shtml",
			postSub : "./add-subscribe-reply.shtml",
			postMessage : "./add-message-reply.shtml",
			robot : "./rebot.shtml",
			postKey : "./add-text-key-reply.shtml",
			postNews : "./add-tuwen-key-reply.shtml",
			keyList : "./get-key-reply.shtml",
			deleteKey : "./delete-key-reply.shtml",
			getReplys : "./get-one-reply.shtml"
		},
		deleteKey : function(id){
			lock.AjaxUtil.post(Ajax.URL.deleteKey, {
				"id" : id
			}, function(result) {
				lock.alertMsg.success("成功", result);
				Ajax.getKeyList();
			});
		},
		getEmoj : function() {
			lock.AjaxUtil.get(Ajax.URL.emoj, {
				"num" : Math.random()
			}, function(result) {
				BaseEmoj = result;
				EventInit();
			});
		},
		getReplys : function(replyId,fn){
			lock.AjaxUtil.get(Ajax.URL.getReplys, {
				"replyId" :replyId
			}, function(result) {
				fn(result);
			});
		},
		robotStatus : function(robot, fn) {

			lock.AjaxUtil.post(Ajax.URL.robot, {
				"robot" : robot
			}, function(result) {
				lock.alertMsg.success("成功", result);
				fn(result);
			});

		},
		postSubData : function(content) {
			content = stringToHtmlEmo(content);
			if (content == null || content == '') {
				lock.alertMsg.error("失败", "内容不能为空");
				return false;
			}
			if (content.length > 600) {
				lock.alertMsg.error("失败", "最多只能输入600个汉字");
				return false;
			}
			lock.AjaxUtil.post(Ajax.URL.postSub, {
				content : content
			}, function(result) {
				lock.alertMsg.success("成功", result);
				resetKeyData();
			});
		},
		postKey : function(id, rNAME, content, keys, type,replys) {
			content = stringToHtmlEmo(content);
			var data = {
				content : content,
				ruleName : rNAME,
				keys : keys,
				replys : replys
			};
			
			if(id){
				data.id = id;
			}

			lock.AjaxUtil.post(Ajax.URL.postKey,data, function(result) {
				if(result.status == "0"){
					lock.alertMsg.error("失败", result.result);
				}
				else if(result.status == "1"){
					lock.alertMsg.success("成功", result.result);
					Ajax.getKeyList();
					UI.keyWorldModel.find("#cancelKeyBtn").click();
				}
			}, lock.AjaxUtil.ajaxError);
		},
		postNews : function(id,rName,ruleKeyWord,replys) {
			
			var obj = {
					ruleName : rName,
					keys : ruleKeyWord,
					items: replys,
					id :id
				};
			
            var data = {
            	data :JSON.stringify(obj)
            }
			
			lock.AjaxUtil.post(Ajax.URL.postNews,data, function(result) {
				Ajax.getKeyList();
				if(result.status == "0"){
					lock.alertMsg.error("失败", result.result);
				}
				else if(result.status == "1"){
					lock.alertMsg.success("成功", result.result);
					UI.keyWorldModel.find("#cancelKeyBtn").click();
				}
			}, lock.AjaxUtil.ajaxError);
		},
		postMessage : function(content) {
			content = stringToHtmlEmo(content);
			if (content == null || content == '') {
				return false;
			}
			if (content.length > 600) {
				lock.alertMsg.error("失败", "最多只能输入600个汉字");
				return false;
			}
			// console.log(content);
			lock.AjaxUtil.post(Ajax.URL.postMessage, {
				content : content
			}, function(result) {
				lock.alertMsg.success("成功", result);
			});
		},
		// 获取关注自动回复信息
		getSubData : function() {
			lock.AjaxUtil.get(Ajax.URL.sub, {}, function(result) {
				var ps = parseHtmlEmo(result);
				ue_01.html(ps);
			});
		},
		getKeyList : function(){
			
			lock.AjaxUtil.get(Ajax.URL.keyList, {}, function(result) {
			
			result = {list : result}
			// 渲染追加
			lock.WebPage.refreshTemplate(UI.keyList, result,
					UI.keyListTemplate);
			});
		},
		getMessageData : function() {
			lock.AjaxUtil.get(Ajax.URL.message, {}, function(res) {
				if (res.robot == "1") {
					UI.peiliao[0].checked = true;
					UI.messageContent.hide();
				} else {
					UI.peiliao[0].checked = false;
					UI.messageContent.show();
				}
				ue_02.html(parseHtmlEmo(res.result));
			});
		},
		needs : function() {
			lock.AjaxUtil.postForm(Ajax.URL.needs, UI.needsForm, function(
					result) {
				lock.alertMsg.warn("提示", result);
				UI.needsForm.find("[name='content']").val("");
			}, lock.AjaxError);
		}
	};

	// 入口
	Ajax.getEmoj();

});
