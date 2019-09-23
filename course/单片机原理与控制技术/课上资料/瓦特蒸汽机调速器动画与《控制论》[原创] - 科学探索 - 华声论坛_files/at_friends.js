var Browser = {};
var max_at_friends = 10;
var at_friend_list = new Array(); // 勾选的用户列表

// 页面
Browser.Page = (function() {
	return {
		scrollTop : function() {
			return Math.max(document.body.scrollTop,
					document.documentElement.scrollTop);
		},
		scrollLeft : function() {
			return Math.max(document.body.scrollLeft,
					document.documentElement.scrollLeft);
		},
		height : function() {
			var _height;
			if (document.compatMode == "CSS1Compat") {
				_height = document.documentElement.scrollHeight;
			} else {
				_height = document.body.scrollHeight;
			}
			return _height;
		},
		width : function() {
			var _width;
			if (document.compatMode == "CSS1Compat") {
				_width = document.documentElement.scrollWidth;
			} else {
				_width = document.body.scrollWidth;
			}
			return _width;
		}
	};
})();

// 窗口：
Browser.Window = (function() {
	return {
		outerHeight : function() {
			var _hei = window.outerHeight;
			if (typeof _hei != "number") {
				_hei = Browser.ViewPort.outerHeight();
			}
			return _hei;
		},
		outerWidth : function() {
			var _wid = window.outerWidth;
			if (typeof _wid != "number") {
				_wid = Browser.ViewPort.outerWidth();
			}
			return _wid;
		},
		innerHeight : function() {
			var _hei = window.innerHeight;
			if (typeof _hel != "number") {
				_hei = Browser.ViewPort.innerHeight();
			}
			return _hei;
		},
		innerWidth : function() {
			var _wid = window.innerWidth;
			if (typeof _wid != "number") {
				_wid = Browser.ViewPort.innerWidth();
			}
			return _wid;
		},
		height : function() {
			return Browser.Window.innerHeight();
		},
		width : function() {
			return Browser.Window.innerWidth();
		}
	}
})();

// 视口:
Browser.ViewPort = (function() {
	return {
		innerHeight : function() {
			var _height;
			if (document.compatMode == "CSS1Compat") {
				_height = document.documentElement.clientHeight;
			} else {
				_height = document.body.clientHeight;
			}
			return _height;
		},
		innerWidth : function() {
			var _width;
			if (document.compatMode == "CSS1Compat") {
				_width = document.documentElement.clientWidth;
			} else {
				_width = document.body.clientWidth;
			}
			return _width;
		},
		outerHeight : function() {
			var _height;
			if (document.compatMode == "CSS1Compat") {
				_height = document.documentElement.offsetHeight;
			} else {
				_height = document.body.offsetHeight;
			}
			return _height;
		},
		outerWidth : function() {
			var _width;
			if (document.compatMode == "CSS1Compat") {
				_width = document.documentElement.offsetWidth;
			} else {
				_width = document.body.offsetWidth;
			}
			return _width;
		},
		width : function() {
			return Browser.ViewPort.innerWidth();
		},
		height : function() {
			return Browser.ViewPort.innerHeight();
		}
	}
})();

function openDiv(newDivID) {
	var at_mast = document.getElementById("at_mask");
	var at_friend = document.getElementById("at_friend");
	if (at_mast != null && at_friend != null) {
		document.getElementById("at_mask").style.display = "block";
		document.getElementById("at_friend").style.display = "block";
		return false;
	} else {
		createPop(newDivID);
	}
}

function createPop(newDivID) {
	var newMaskID = "at_mask";
	var newMaskWidth = document.body.scrollWidth;
	var newMaskHeight = document.body.scrollHeight;
	var newMask = document.createElement("div");
	newMask.id = newMaskID;
	newMask.style.position = "absolute";
	newMask.style.zIndex = "99999";
	newMask.style.width = newMaskWidth + "px";
	newMask.style.height = newMaskHeight + "px";
	newMask.style.top = "0px";
	newMask.style.left = "0px";
	newMask.style.background = "black";
	newMask.style.filter = "alpha(opacity=40)";// 遮罩层透明度IE
	newMask.style.opacity = "0.40";// 遮罩层透明度FF
	document.body.appendChild(newMask);// 遮罩层添加到DOM中

	data = "<div class=\"tanchubox\">"
			+ "<div class=\"tc_top\"><div class=\"tc_topl\">@您的好友</div>"
			+ "<div class=\"tc_topr\"><a onclick=\"close_at_pop();\" href=\"javascript:;\"><img border=\"0\" width=\"19\" height=\"17\" src=\"images/atfriend/tanchu_x.gif\"></a></div>"
			+ "</div>"
			+ "<div class=\"tc_box\">"
			+ "<div class=\"tc_search\">"
			+ "<div class=\"tc_search_box\"><input type=\"text\" style=\"height:16px; width:138px; line-height:18px; font-size:12px; color:#999; border:0px;\" placeholder=\"查找您的好友\" id=\"search_name\"></div>"
			+ "<div class=\"tc_search_button\"><input type=\"button\" onclick=\"search_fd()\" style=\"width:21px; height:22px; background:url(images/atfriend/tanchu_seach.gif) no-repeat; border:none; outline:0; cursor:pointer;\" name=\"login\"></div>"
			+ "</div>"
			+ "<div class=\"tc_friend\" id=\"frd_content\">"
			+ "正在加载您的好友列表..."
			+ "</div>"
			+ "</div>"
			+ "<div class=\"tc_bottom\">"
			+ "<span></span>"
			+ "<div class=\"tc_bottom_botton\"><a onfocus=\"this.blur()\" onclick=\"insert_fd()\" href=\"javascript:;\"></a></div>"
			+ "<div class=\"tc_bottom_text\">已选<span id=\"cur_select_num\">0</span>位<br/>每次最多@10位好友</div>"
			+ "</div>" + "</div>";
	
	var fd_list_css = "<input type=\"hidden\"/><style>"+
			"body { -webkit-text-size-adjust:none; padding:0; margin:0; background:#f0f0f0; font-size:12px; font-family:\"微软雅黑\";}" +
			"div { color:#333; word-wrap:break-word; margin:0px; padding:0px;}" +
			"ul, li, h4 { margin:0px; padding:0px;}" +
			"ul { list-style:none;}" +
			"img { border:0px;}" +
			"a { text-decoration:none; color:#333;}" +
			".tanchuk { margin:0 auto; height:auto; width:1180px; padding-top:260px; }" +
			".tanchubox { margin:0 auto; height:372px; width:456px; }" +
			".tc_top { float:left; height:31px; width:456px; background:url(../../images/atfriend/tanchu_top.png) no-repeat; }" +
			".tc_topl { float:left; height:31px; width:350px; padding-left:14px; font-size:16px; font-family: \"微软雅黑\",\"宋体\"; font-weight:bold; color:#fff; line-height:31px; }" +
			".tc_topl h4 { float:left; height:31px; width:90px; line-height:31px;}" +
			".tc_topl span { float:left; height:12px; line-height:14px; margin-top:11px; display:inline; font-size:12px; font-weight:normal; color:#999; }" +
			".tc_topr { float:right; height:17px; width:38px; padding:7px 0; text-align:center; }" +
			".tc_box { float:left; height:269px; width:446px; padding:5px; background:#fff; }" +
			".tc_search { float:left; height:22px; width:173px; margin:5px 0 12px 10px !important; margin:5px 0 12px 4px; }" +
			".tc_search_box { float:left; height:20px; width:143px; padding-left:5px; border:1px solid #ccc; }" +
			".tc_search_button { float:left; height:22px; width:21px; }" +
			".tc_friend { float:left; height:225px; width:438px; margin-left:4px; }" +
			".tc_friend ul { height:225px; width:438px; overflow:hidden; overflow-x:hidden; overflow-y:scroll; }" +
			".tc_friend ul li { float:left; height:36px; width:200px; margin:0 10px 9px 0; }" +
			".tc_friend_button { float:left; height:36px; width:172px; margin:0 14px !important; margin:0 7px; background:url(../../images/atfriend/tanchu_friend_bg.png) no-repeat; }" +
			".tc_friend_button img { float:left; height:32px; width:32px; margin-left:10px; }" +
			".tc_friend_button span { float:right; height:30px; width:120px; line-height:30px; margin:6px 0 0 10px; }" +
			".tc_friend_tick { float:left; height:12px; width:12px; margin:-16px 0 0 44px; display:none; background:url(../../images/atfriend/tanchu_tick.png) no-repeat;}"+
			".tc_friend_tick a { float:left; height:12px; width:12px; }" +
			".tc_bottom { float:left; height:62px; width:456px; background:url(../../images/atfriend/tanchu_bottom.png) no-repeat; }" +
			".tc_bottom_botton { float:left; height:34px; width:113px; margin:17px 0 0 218px; display:inline; }" +
			".tc_bottom_botton a { float:left; height:34px; width:113px; background:url(../../images/atfriend/tanchu_bottom_botton1.png) no-repeat; }" +
			".tc_bottom_botton a:hover { float:left; height:34px; width:113px; background:url(../../images/atfriend/tanchu_bottom_botton2.png) no-repeat; }" +			
			".tc_friend_checked a{font-weight:bold; color:#0d78d5;}" +
			".tc_friend_nocheck a{color:#333;}" +
			".tc_bottom_text { float:left; height:26px; line-height:18px; margin:15px 0 8px 8px; display:inline; color:#666; }" +
			"#cur_select_num{color:#0D7AD9; font-weight:bold; padding:0px 5px 0px 5px;}" +
			".clearfloat { clear:both; height:0; font-size:1px; line-height: 0px;}"+
			"</style>";

	// 新弹出层
	var newDivWidth = 456;
	var newDivHeight = 374;
	var newDiv = document.createElement("div");
	newDiv.id = newDivID;
	newDiv.className = "tanchubox";
	newDiv.style.position = "absolute";
	newDiv.style.zIndex = "100000";
	newDiv.style.width = newDivWidth + "px";
	newDiv.style.height = newDivHeight + "px";

	var newDivtop = Math.round(Browser.Page.scrollTop()
			+ (Browser.ViewPort.height() / 2) - (parseInt(newDivHeight) / 2));
	var newDivleft = Math.round(Browser.Page.scrollLeft()
			+ (Browser.ViewPort.width() / 2) - (parseInt(newDivWidth) / 2));

	newDiv.style.top = newDivtop + "px";// 新弹出层距离上边距离
	newDiv.style.left = newDivleft + "px";// 新弹出层距离左边距离
	newDiv.style.background = "#999999";
	newDiv.innerHTML = fd_list_css + data;
	document.body.appendChild(newDiv);// 新弹出层添加到DOM中

}

function inarray(obj, arr) {
	if (typeof(obj) == "string") {
		for (var i in arr) {
			if (arr[i] == obj) {
				return true;
			}
		}
	}
	return false;
}

Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};

Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

// 关闭at好友弹出层
function close_at_pop() {
	document.getElementById("at_mask").style.display = "none";
	document.getElementById("at_friend").style.display = "none";
	return false;
}

function clickCheck(idx) {
	var li_obj = document.getElementById("li_name_" + idx);
	var name = li_obj.childNodes[2].value;
	var span = li_obj.childNodes[0].childNodes[1];
	var sign = li_obj.childNodes[1];
	
	if (at_count() >= max_at_friends) {
		if (inarray(name, at_friend_list)) {
			at_friend_list.remove(name);
			span.className = "tc_friend_nocheck";
			sign.style.display = "none";
		}
	} else {
		if (!inarray(name, at_friend_list)) {
			at_friend_list.push(name);
			span.className = "tc_friend_checked";
			sign.style.display = "inline";
		} else {
			at_friend_list.remove(name);
			span.className = "tc_friend_nocheck";
			sign.style.display = "none";
		}
	}
	document.getElementById("cur_select_num").innerHTML = at_count();
}

function at_count() {
	return at_friend_list.length;
}

// ----入口函数
var is_get_at_friends_before = 0; // 用于判断是否成功加载过好友列表数据，如果一个页面打开之后已经成功加载过一次，则再次点击的时候不重新加载；如果没有成功加载过一次，则加载。
function atFriends() {
	openDiv("at_friend");
	if (!is_get_at_friends_before) {
		getFriends();
	}

}

function getFriends() {
	ajaxrequest("/ajax.php", "post", true, "?action=atfriend", parseResponse,
			document);
}

function search_fd() {
	var name = document.getElementById("search_name").value;
	ajaxrequest("/ajax.php", "post", true, "?action=atfriend&op=search&name="
			+ name, parseResponse, document);
}

function parseResponse(response, obj) {
	var data = response.responseText;
	if (data != "" || data.length > 0) {
		data = "<ul>" + data + "</ul>";
		document.getElementById("frd_content").innerHTML = data;
		is_get_at_friends_before = 1;

	} else {
		is_get_at_friends_before = 0;
		document.getElementById("frd_content").innerHTML = "<font color=red>没有数据！</font>";
		setTimeout("close_at_pop()", 3000);
	}
}

function insert_fd() {
	var insert_str = "";
	var fd_step = 1;
	for ( var i = 0; i < at_friend_list.length; i++) {
		if (fd_step <= 10) {
			insert_str += "@" + at_friend_list[i] + " ";
		}
		fd_step++;
	}
	insertBBCode(insert_str);
	close_at_pop();
}

/**
 * 得到ajax对象
 */
function getajaxHttp() {
	var xmlHttp;
	try {
		// Firefox, Opera 8.0+, Safari
		xmlHttp = new XMLHttpRequest();
	} catch (e) {
		// Internet Explorer
		try {
			xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
				alert("您的浏览器不支持AJAX！");
				return false;
			}
		}
	}
	return xmlHttp;
}

/**
 * 发送ajax请求 url--url methodtype(post/get) con (true(异步)|false(同步)) parameter(参数)
 * callback(回调方法名，不需要引号,这里只有成功的时候才调用) (注意：这方法有二个参数，一个就是xmlhttp,一个就是要处理的对象)
 * obj需要到回调方法中处理的对象
 */
function ajaxrequest(url, methodtype, con, parameter, callback, obj) {
	var xmlhttp = getajaxHttp();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			callback(xmlhttp, obj);
		}
	};
	url = url + parameter;
	url = encodeURI(url)
	xmlhttp.open(methodtype, url, con);
	xmlhttp.send(null);
}
