/**
 * 登录业务js
 */

define(function(require, exports, module) {


    //引入依赖
    var  $ = window.$;
    var lock =  require("lock");

    var LoginUI = {

         loginForm : $("#loginForm"),
         error     : $("#error-login"),
         number    : $("#number")

    };
    
    function GetLastUser() {
		var id = "49BAC005-7D5B-4231-8CEA-16939BEACD67";
		var usr = GetCookie(id);
		if (usr != null) {
			document.getElementById('j_username').value = usr;
		}
		// is remember password
		var pwd = GetCookie(usr);
		if (pwd != null) {
			document.getElementById('rememberP').checked = true;
			document.getElementById('j_password').value = pwd;
		} else {
			document.getElementById('rememberP').checked = false;
			document.getElementById('j_password').value = "";
		}
	}
   
  function SetPwdAndChk() {
		//取用户名
		var usr = document.getElementById('j_username').value;
		//将最后一个用户信息写入到Cookie
		SetLastUser(usr)  ;
		//如果记住密码选项被选中
		if (document.getElementById('rememberP').checked == true) {
			//取密码值
			
			var pwd = document.getElementById('j_password').value;
			var expdate = new Date();
			expdate.setTime(expdate.getTime() + 30 * (24 * 60 * 60 * 1000));
			//将用户名和密码写入到Cookie
			SetCookie(usr, pwd, expdate);
		} else {
			// reset pwd cookie
			SetCookie(usr, null, new Date());
		}
 }
  
 function SetLastUser(usr) {
		var id = "49BAC005-7D5B-4231-8CEA-16939BEACD67";
		var expdate = new Date();
		//当前时间加上两周的时间
		expdate.setTime(expdate.getTime() + 30 * (24 * 60 * 60 * 1000));
		SetCookie(id, usr, expdate);
	}
	//取Cookie的值
	function GetCookie(name) {
		var arg = name + "=";
		var alen = arg.length;
		var clen = document.cookie.length;
		var i = 0;
		while (i < clen) {
			var j = i + alen;
			if (document.cookie.substring(i, j) == arg)
				return getCookieVal(j);
			i = document.cookie.indexOf(" ", i) + 1;
			if (i == 0)
				break;
		}
		return null;
	}

	//var isPostBack = "False";
	function getCookieVal(offset) {
		var endstr = document.cookie.indexOf(";", offset);
		if (endstr == -1)
			endstr = document.cookie.length;
		return unescape(document.cookie.substring(offset, endstr));
	}
	//写入到Cookie
	function SetCookie(name, value, expires) {
		var argv = SetCookie.arguments;
		//本例中length = 3
		var argc = SetCookie.arguments.length;
		var expires = (argc > 2) ? argv[2] : null;
		var path = (argc > 3) ? argv[3] : null;
		var domain = (argc > 4) ? argv[4] : null;
		var secure = (argc > 5) ? argv[5] : false;
		document.cookie = name
				+ "="
				+ escape(value)
				+ ((expires == null) ? "" : ("; expires=" + expires
						.toGMTString()))
				+ ((path == null) ? "" : ("; path=" + path))
				+ ((domain == null) ? "" : ("; domain=" + domain))
				+ ((secure == true) ? "; secure" : "");
	} 
    
    
    
    LoginUI.loginForm.find(".login").click(function(){
    	SetPwdAndChk();
    });
    
    var LoginEvent = {

        init : function(){
            LoginEvent.form();

        },

        form : function(){
               //首次提示错误
               if(LoginUI.error.val()){
                   $('#alertModel').modal("show");
               }

               lock.animate.numberScroll(LoginUI.number);

        }
    };

    var LoginAjax = {

    };

    LoginEvent.init();


});
