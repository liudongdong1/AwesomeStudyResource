//common-ajax-menu-bbcode->union
function ignoreError() {  return true;}
window.onerror = ignoreError;

var $ = function(objId){
	if(!objId){return null; }
	if(document.getElementById){
		return eval('document.getElementById("' + objId + '")');
	}else if(document.layers){
		return eval("document.layers['" + objId +"']");
	}else{
		return eval('document.all.' + objId);
	}
};

var sPop = null;
var postSubmited = false;
var smdiv = new Array();

var userAgent = navigator.userAgent.toLowerCase();
var is_webtv = userAgent.indexOf('webtv') != -1;
var is_kon = userAgent.indexOf('konqueror') != -1;
var is_mac = userAgent.indexOf('mac') != -1;
var is_saf = userAgent.indexOf('applewebkit') != -1 || navigator.vendor == 'Apple Computer, Inc.';
var is_opera = userAgent.indexOf('opera') != -1 && opera.version();
var is_moz = (navigator.product == 'Gecko' && !is_saf) && userAgent.substr(userAgent.indexOf('firefox') + 8, 3);
var is_ns = userAgent.indexOf('compatible') == -1 && userAgent.indexOf('mozilla') != -1 && !is_opera && !is_webtv && !is_saf;
var is_ie = (userAgent.indexOf('msie') != -1 && !is_opera && !is_saf && !is_webtv) && userAgent.substr(userAgent.indexOf('msie') + 5, 3);

function ctlent(event, clickactive) {
	if(postSubmited == false && (event.ctrlKey && event.keyCode == 13) || (event.altKey && event.keyCode == 83) && $('postsubmit')) {
		if(in_array($('postsubmit').name, ['topicsubmit', 'replysubmit', 'editsubmit', 'pmsubmit']) && !validate($('postform'))) {
			doane(event);
			return;
		}
		postSubmited = true;
		if(!isUndefined(clickactive) && clickactive) {
			$('postsubmit').click();
			$('postsubmit').disabled = true;
		} else {
			$('postsubmit').disabled = true;
			$('postform').submit();
		}
	}
}

function storeCaret(textEl){
	if(textEl.createTextRange){
		textEl.caretPos = document.selection.createRange().duplicate();
	}
	if(document.getElementById("emotclass") && document.getElementById("viewface").style.display != "none")ShowForum_Emot(1);
}

function checkall(form, prefix, checkall) {
	var checkall = checkall ? checkall : 'chkall';
	for(var i = 0; i < form.elements.length; i++) {
		var e = form.elements[i];
		if(e.name != checkall && e.type == 'checkbox' && (!prefix || (prefix && e.name.match(prefix)))) {
			e.checked = form.elements[checkall].checked;
		}
	}
}

function arraypop(a) {
	if(typeof a != 'object' || !a.length) {
		return null;
	} else {
		var response = a[a.length - 1];
		a.length--;
		return response;
	}
}

function arraypush(a, value) {
	a[a.length] = value;
	return a.length;
}


function findtags(parentobj, tag) {
	if(!isUndefined(parentobj.getElementsByTagName)) {
		return parentobj.getElementsByTagName(tag);
	} else if(parentobj.all && parentobj.all.tags) {
		return parentobj.all.tags(tag);
	} else {
		return null;
	}
}

function copycode(obj) {
	if(is_ie && obj.style.display != 'none') {
		var rng = document.body.createTextRange();
		rng.moveToElementText(obj);
		rng.scrollIntoView();
		rng.select();
		rng.execCommand("Copy");
		rng.collapse(false);
	}
}

function attachimg(obj, action, text) {
	if(action == 'load') {
		if(obj.width > screen.width * 0.7) {
			obj.resized = true;
			obj.width = screen.width * 0.7;
			obj.alt = text;
		}
		obj.onload = null;
	} else if(action == 'mouseover') {
		if(obj.resized) {
			obj.style.cursor = 'pointer';
		}
	} else if(action == 'click') {
		if(!obj.resized) {
			return false;
		} else {
			window.open(text);
		}
	}
}

function attachimginfo(obj, infoobj, show, event) {
	var left_offset = obj.offsetLeft;
	var top_offset = obj.offsetTop;
	var width_offset = obj.offsetWidth;
	var height_offset = obj.offsetHeight;
	while ((obj = obj.offsetParent) != null) {
		left_offset += obj.offsetLeft;
		top_offset += obj.offsetTop;
	}
	if(show) {
		$(infoobj).style.position = 'absolute';
		$(infoobj).style.left = left_offset + 3;
		$(infoobj).style.top = height_offset < 40 ? top_offset + height_offset : top_offset + 3;
		$(infoobj).style.display = '';
	} else {
		if(is_ie) {
			$(infoobj).style.display = 'none';
			return;
		} else {
			var mousex = document.body.scrollLeft + event.clientX;
			var mousey = document.body.scrollTop + event.clientY;
			if(mousex < left_offset || mousex > left_offset + width_offset || mousey < top_offset || mousey > top_offset + height_offset) {
				$(infoobj).style.display = 'none';
			}
		}
	}
}

function toggle_collapse(objname, unfolded) {
	if(isUndefined(unfolded)) {
		var unfolded = 1;
	}
	var obj = $(objname);
	var oldstatus = obj.style.display;
	var collapsed = getcookie('discuz_collapse');
	var cookie_start = collapsed ? collapsed.indexOf(objname) : -1;
	var cookie_end = cookie_start + objname.length + 1;

	obj.style.display = oldstatus == 'none' ? '' : 'none';
	collapsed = cookie_start != -1 && ((unfolded && oldstatus == 'none') || (!unfolded && oldstatus == '')) ?
	collapsed.substring(0, cookie_start) + collapsed.substring(cookie_end, collapsed.length) : (
	cookie_start == -1 && ((unfolded && oldstatus == '') || (!unfolded && oldstatus == 'none')) ?
	collapsed + objname + ' ' : collapsed);

	setcookie('discuz_collapse', collapsed, (collapsed ? 86400 * 30 : -(86400 * 30 * 1000)));

	if(img = $(objname + '_img')) {
		var img_regexp = new RegExp((oldstatus == 'none' ? '_yes' : '_no') + '\\.gif$');
		var img_re = oldstatus == 'none' ? '_no.gif' : '_yes.gif';
		img.src = img.src.replace(img_regexp, img_re);
	}
	if(symbol = $(objname + '_symbol')) {
		symbol.innerHTML = symbol.innerHTML == '+' ? '-' : '+';
	}
}

function imgzoom(o) {
	if(event.ctrlKey) {
		var zoom = parseInt(o.style.zoom, 10) || 100;
		zoom -= event.wheelDelta / 12;
		if(zoom > 0) {
			o.style.zoom = zoom + '%';
		}
		return false;
	} else {
		return true;
	}
}

function getcookie(name) {
	var cookie_start = document.cookie.indexOf(name);
	var cookie_end = document.cookie.indexOf(";", cookie_start);
	return cookie_start == -1 ? '' : unescape(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
}

function setcookie(cookieName, cookieValue, seconds, path, domain, secure) {
	var expires = new Date();
	expires.setTime(expires.getTime() + seconds*1000);
	document.cookie = escape(cookieName) + '=' + escape(cookieValue)
	+ (expires ? '; expires=' + expires.toGMTString() : '')
	+ (path ? '; path=' + path : '/')
	+ (domain ? '; domain=' + domain : '')
	+ (secure ? '; secure' : '');
}

function getCokad(name){var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)")); if(arr != null) return unescape(arr[2]); return null;}
function setCokad(hhours,name,value){var exp  = new Date();exp.setTime(exp.getTime() + hhours*60*60*1000); document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";}

function AddText(txt) {
	obj = $('postform').message;
	selection = document.selection;
	checkFocus();
	if(!isUndefined(obj.selectionStart)) {
		var opn = obj.selectionStart + 0;
		obj.value = obj.value.substr(0, obj.selectionStart) + txt + obj.value.substr(obj.selectionEnd);
	} else if(selection && selection.createRange) {
		var sel = selection.createRange();
		sel.text = txt;
		sel.moveStart('character', -strlen(txt));
	} else {
		obj.value += txt;
	}
}

function insertAtCaret(textEl, text){
	if(textEl.createTextRange && textEl.caretPos){
		var caretPos = textEl.caretPos;
		caretPos.text += caretPos.text.charAt(caretPos.text.length - 2)	== ' ' ? text +	' ' : text;
	} else if(textEl) {
		textEl.value +=	text;
	} else {
		textEl.value = text;
	}
}

function checkFocus() {
	var obj = typeof wysiwyg == 'undefined' || !wysiwyg ? $('postform').message : editwin;
	if(!obj.hasfocus) {
		obj.focus();
	}
}

function setCaretAtEnd() {
	var obj = typeof wysiwyg == 'undefined' || !wysiwyg ? $('postform').message : editwin;
	if(typeof wysiwyg != 'undefined' && wysiwyg) {
		if(is_moz || is_opera) {

		} else {
			var sel = editdoc.selection.createRange();
			sel.moveStart('character', strlen(getEditorContents()));
			sel.select();
		}
	} else {
		if(obj.createTextRange)  {
			var sel = obj.createTextRange();
			sel.moveStart('character', strlen(obj.value));
			sel.collapse();
			sel.select();
		}
	}
}

function strlen(str) {
	return (is_ie && str.indexOf('\n') != -1) ? str.replace(/\r?\n/g, '_').length : str.length;
}

function mb_strlen(str) {
	var len = 0;
	for(var i = 0; i < str.length; i++) {
		len += str.charCodeAt(i) < 0 || str.charCodeAt(i) > 255 ? (charset == 'utf-8' ? 3 : 2) : 1;
	}
	return len;
}

function insertSmiley(smilieid) {
	checkFocus();
	var src = $('smilie_' + smilieid).src;
	var code = $('smilie_' + smilieid).pop;
	if(typeof wysiwyg != 'undefined' && wysiwyg && allowsmilies && (!$('smileyoff') || $('smileyoff').checked == false)) {
		if(is_moz) {
			applyFormat('InsertImage', false, src);
			var smilies = findtags(editdoc.body, 'img');
			for(var i = 0; i < smilies.length; i++) {
				if(smilies[i].src == src && smilies[i].getAttribute('smilieid') < 1) {
					smilies[i].setAttribute('smilieid', smilieid);
					smilies[i].setAttribute('border', "0");
				}
			}
		} else {
			insertText('<img src="' + src + '" border="0" smilieid="' + smilieid + '" alt="" /> ', false);
		}
	} else {
		code += ' ';
		AddText(code);
	}
}


function smileyMenu(ctrl) {
	ctrl.style.cursor = 'pointer';
	if(ctrl.alt) {
		ctrl.pop = ctrl.alt;
		ctrl.alt = '';
	}
	if(ctrl.title) {
		ctrl.lw = ctrl.title;
		ctrl.title = '';
	}
	if(!smdiv[ctrl.id]) {
		smdiv[ctrl.id] = document.createElement('div');
		smdiv[ctrl.id].id = ctrl.id + '_menu';
		smdiv[ctrl.id].style.display = 'none';
		smdiv[ctrl.id].className = 'popupmenu_popup';
		ctrl.parentNode.appendChild(smdiv[ctrl.id]);
	}
	smdiv[ctrl.id].innerHTML = '<table style="width: 60px;height: 60px;text-align: center;vertical-align: middle;" class="altbg2"><tr><td><img src="' + ctrl.src + '" border="0" width="' + ctrl.lw + '" /></td></tr></table>';
	showMenu(ctrl.id, 0, 0, 1, 0);
}

function announcement() {
	$('announcement').innerHTML = '<marquee style="margin: 0px 8px" direction="left" scrollamount="2" scrolldelay="1" onMouseOver="this.stop();" onMouseOut="this.start();">' +
	$('announcement').innerHTML + '</marquee>';
	$('announcement').style.display = 'block';
}

function in_array(needle, haystack) {
	if(typeof needle == 'string') {
		for(var i in haystack) {
			if(haystack[i] == needle) {
				return true;
			}
		}
	}
	return false;
}

function saveData(data, del) {
	if(!data && isUndefined(del)) {
		return;
	}
	if(typeof wysiwyg != 'undefined' && typeof editorid != 'undefined' && typeof bbinsert != 'undefined' && bbinsert && $(editorid + '_mode') && $(editorid + '_mode').value == 1) {
		data = html2bbcode(data);
	}
	if(is_ie) {
		try {
			var oXMLDoc = textobj.XMLDocument;
			var root = oXMLDoc.firstChild;
			if(root.childNodes.length > 0) {
				root.removeChild(root.firstChild);
			}
			var node = oXMLDoc.createNode(1, 'POST', '');
			var oTimeNow = new Date();
			oTimeNow.setHours(oTimeNow.getHours() + 24);
			textobj.expires = oTimeNow.toUTCString();
			node.setAttribute('message', data);
			oXMLDoc.documentElement.appendChild(node);
			textobj.save('Discuz!');
		} catch(e) {}
	} else if(window.sessionStorage) {
		try {
			sessionStorage.setItem('Discuz!', data);
		} catch(e) {}
	}
}

function loadData() {
	var message = '';
	if(is_ie) {
		try {
			textobj.load('Discuz!');
			var oXMLDoc = textobj.XMLDocument;
			var nodes = oXMLDoc.documentElement.childNodes;
			message = nodes.item(nodes.length - 1).getAttribute('message');
		} catch(e) {}
	} else if(window.sessionStorage) {
		try {
			message = sessionStorage.getItem('Discuz!');
		} catch(e) {}
	}

	if(in_array((message = trim(message)), ['', 'null', 'false', null, false])) {
		alert(lang['post_autosave_none']);
		return;
	}
	if((typeof wysiwyg == 'undefined' || !wysiwyg ? textobj.value : editdoc.body.innerHTML) == '' || confirm(lang['post_autosave_confirm'])) {
		if(typeof wysiwyg == 'undefined' || !wysiwyg) {
			textobj.value = message;
		} else {
			editdoc.body.innerHTML = bbcode2html(message);
		}
	}
}

function deleteData() {
	if(is_ie) {
		saveData('', 'delete');
	} else if(window.sessionStorage) {
		try {
			sessionStorage.removeItem('Discuz!');
		} catch(e) {}
	}
}

function updateseccode(width, height, settime) {
	if(isUndefined(settime)) {
		var settime = 1000;
	}
	$('seccodeimage').innerHTML = "加载验证码...";
	htmlstr = '<img id="seccode" onclick="updateseccode(' + width + ', '+ height + ',0)" width="' + width + '" height="' + height + '" src="seccode.php?update=' + Math.random() + '" class="absmiddle" alt="" />';
	window.setTimeout("$('seccodeimage').innerHTML = htmlstr;",settime);
}

function signature(obj) {
	if(obj.style.maxHeightIE != '') {
		var height = (obj.scrollHeight > parseInt(obj.style.maxHeightIE)) ? obj.style.maxHeightIE : obj.scrollHeight;
		if(obj.innerHTML.indexOf('<IMG ') == -1) {
			obj.style.maxHeightIE = '';
		}
		return height;
	}
}

function trim(str) {
	return (str + '').replace(/(\s+)$/g, '').replace(/^\s+/g, '');
}

function fetchCheckbox(cbn) {
	try {
		return $(cbn) && $(cbn).checked == true ? 1 : 0;
	} catch (e) {
		return 0;
	}
}

function parseurl(str, mode) {
	str = str.replace(/([^>=\]"'\/]|^)((((https?|ftp):\/\/)|www\.)([\w\-]+\.)*[\w\-\u4e00-\u9fa5]+\.([\.a-zA-Z0-9]+|\u4E2D\u56FD|\u7F51\u7EDC|\u516C\u53F8)((\?|\/|:)+[\w\.\/=\?%\-&~`@':+!]*)+\.(jpg|gif|png|bmp))/ig, mode == 'html' ? '$1<img src="$2" border="0">' : '$1[img]$2[/img]');
	str = str.replace(/([^>=\]"'\/@]|^)((((https?|ftp|gopher|news|telnet|rtsp|mms|callto|bctp|ed2k):\/\/))([\w\-]+\.)*[:\.@\-\w\u4e00-\u9fa5]+\.([\.a-zA-Z0-9]+|\u4E2D\u56FD|\u7F51\u7EDC|\u516C\u53F8)((\?|\/|:)+[\w\.\/=\?%\-&~`@':+!#]*)*)/ig, mode == 'html' ? '$1<a href="$2" target="_blank">$2</a>' : '$1[url]$2[/url]');
	str = str.replace(/([^\w>=\]:"'\.\/]|^)(([\-\.\w]+@[\.\-\w]+(\.\w+)+))/ig, mode == 'html' ? '$1<a href="mailto:$2">$2</a>' : '$1[email]$2[/email]');
	return str;
}

function isUndefined(variable) {
	return typeof variable == 'undefined' ? true : false;
}

function addbookmark(sURL, sTitle){
//	try
//	{
//		window.external.addFavorite(sURL, sTitle);
//	}
//	catch (e)
//	{
//		try
//		{
//			window.sidebar.addPanel(sTitle, sURL, "");
//		}
//		catch (e)
//		{
//			alert("加入收藏失败，请使用Ctrl+D进行添加");
//		}
//	}

               clipBoardContent = sURL+"\r\n"+sTitle;  
               if (window.clipboardData){   
                  if(window.clipboardData.setData("Text",clipBoardContent)){   
                      alert("帖子标题和链接已复制，您可以转发给QQ/MSN上的好友了。");   
                  }   
               }   
               else{   
               	  alert("您使用的浏览器不支持此功能，请到地址栏复制链接");   
               }   
}

function doane(event) {
	e = event ? event : window.event ;
	if(is_ie) {
		e.returnValue = false;
		e.cancelBubble = true;
	} else {
		e.stopPropagation();
		e.preventDefault();
	}
}

// add for images alt
var isvisible;
tPopWait=50;
tPopShow=5000;
showPopStep=20;
popOpacity=99;
sPop=null;
curShow=null;
tFadeOut=null;
tFadeIn=null;
tFadeWaiting=null;
document.write('<div style="display:none;background-color: #F7F8F3;color:#000000; border: 1px #000000 solid;filter: Alpha(Opacity=90);font-size:12px;position:absolute;padding:2px 4px 2px 4px;z-index:1000;" id="_altlayer">title</div>');
//document.body.onmousemove=quickalt;
document.body.onmouseover=getalt;
document.body.onmouseout=restorealt;
var tempalt='';

var UA=navigator.userAgent.toLowerCase();
var ISIE=(UA.indexOf("msie") > 0);
//function $(hw_){return document.getElementById(hw_);}

function _Move(evn,o){
	_bW=document.body.clientWidth;
	_left1=document.body.scrollLeft+evn.clientX+10;
	_oW=o.offsetWidth;
	_left=((evn.clientX+_oW)>_bW)?(_left1-_oW-10):_left1;
	if((evn.clientX+_oW)>_bW){_left=(_oW<evn.clientX)?(_left1-_oW-10):_left1;}
	_bH=document.body.clientHeight;
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop || 0;
	_top1=scrollTop+evn.clientY+6;
	_oH=o.offsetHeight;
	_top=((evn.clientY+_oH)>_bH)?(_top1-_oH-6):_top1;
	if((evn.clientY+_oH)>_bH){_top1=(_oH<evn.clientY)?(_top1-_oH-6):_top1;}
	o.style.left=_left+'px';
	o.style.top=_top+'px';
}

function getalt(hw_){
	if(ISIE){evn=event}else{evn=hw_}
	var eo = evn.srcElement?evn.srcElement:evn.target;
	if(eo.title && (eo.title!=""|| (eo.title=="" && tempalt!=""))){
		o = $("_altlayer");
		_Move(evn,o);
		o.style.display='';
		tempalt=eo.title;
		tempbg=eo.getAttribute("altbg");
		tempcolor=eo.getAttribute("altcolor");
		tempborder=eo.getAttribute("altborder");
		eo.title='';
		o.innerHTML=tempalt;
		if (tempbg!=null){o.style.background=tempbg}//else{o.style.background="infobackground"}
		if (tempcolor!=null){o.style.color=tempcolor}//else{o.style.color=tempcolor="infotext"}
		if (tempborder!=null){o.style.border="1px solid "+tempborder;}//else{o.style.border="1px solid #000000";}
		o.style.filter="Alpha()";
		o.filters.Alpha.opacity=0;
		//curShow=setTimeout(quickalt,tPopWait);
		quickalt(hw_);
	} else {
		clearTimeout(curShow);
		clearTimeout(tFadeOut);
		clearTimeout(tFadeIn);
		clearTimeout(tFadeWaiting);
	}
}
function quickalt(hw_){
	if(ISIE){evn=event}else{evn=hw_}
	o = $("_altlayer");
	if(o.style.display==""){
		_Move(evn,o);
	}
	o.style.filter="Alpha(Opacity=0)";
	fadeOut();
}
function restorealt(hw_){
	if(ISIE){evn=event}else{evn=hw_}
	var eo = evn.srcElement?evn.srcElement:evn.target;
	eo.title=tempalt;
	tempalt="";
	//fadeIn();
	$("_altlayer").style.display="none";
}
function fadeOut(){
	if($("_altlayer").filters.Alpha.opacity<popOpacity) {
		$("_altlayer").filters.Alpha.opacity+=showPopStep;
		tFadeOut=setTimeout("fadeOut()",1);
	} else {
		$("_altlayer").filters.Alpha.opacity=popOpacity;
		tFadeWaiting=setTimeout("fadeIn()",tPopShow);
	}
}
function fadeIn(){
	if($("_altlayer").filters.Alpha.opacity>0) {
		$("_altlayer").filters.Alpha.opacity-=1;
		tFadeIn=setTimeout("fadeIn()",1);
	}
}

//copy clipboard
function setcopy(meintext,okmsg)
{
	if (window.clipboardData)    {
		window.clipboardData.setData("Text", meintext);
	}
	else if (window.netscape)    {
		netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
		var clip = Components.classes['@mozilla.org/widget/clipboard;1']
		.createInstance(Components.interfaces.nsIClipboard);
		if (!clip) return;
		var trans = Components.classes['@mozilla.org/widget/transferable;1']
		.createInstance(Components.interfaces.nsITransferable);
		if (!trans) return;
		trans.addDataFlavor('text/unicode');
		var str = new Object();
		var len = new Object();
		var str = Components.classes["@mozilla.org/supports-string;1"]
		.createInstance(Components.interfaces.nsISupportsString);
		var copytext=meintext;
		str.data=copytext;
		trans.setTransferData("text/unicode",str,copytext.length*2);
		var clipid=Components.interfaces.nsIClipboard;
		if (!clip) return false;
		clip.setData(trans,null,clipid.kGlobalClipboard);
	}
	if(okmsg=="") okmsg = "信息复制成功！";
	if(okmsg!=="none") alert(okmsg);
	return false;
}

//发帖等级
function list_user_(id){
	var thelevel;
	if (id>12000)     thelevel = "大彻大悟";
	else if (id>10000)thelevel = "圣元老";
	else if (id>8000) thelevel = "掌门元老";
	else if (id>6000) thelevel = "传功元老";
	else if (id>4400) thelevel = "准元老";
	else if (id>3600) thelevel = "圣仙";
	else if (id>3000) thelevel = "武林盟主";
	else if (id>2500) thelevel = "盟主顾问";
	else if (id>2100) thelevel = "长老辈";
	else if (id>1800) thelevel = "独孤侠";
	else if (id>1500) thelevel = "英雄";
	else if (id>1200) thelevel = "勇士";
	else if (id>1000) thelevel = "骑侠";
	else if (id>800)  thelevel = "剑侠";
	else if (id>600)  thelevel = "老虾级";
	else if (id>300)  thelevel = "大虾辈";
	else if (id>100)  thelevel = "小虾客";
	else              thelevel = "新手上路";
	return thelevel;
}

//显示组
function list_group_(id){
	var thegroup;
	if (id == 1) thegroup = "管理员";
	else if (id == 2) thegroup = "超级版主";
	else if (id == 3) thegroup = "版主";
	else if (id == 4) thegroup = "禁止发言";
	else if (id == 5) thegroup = "禁止访问";
	else if (id == 6) thegroup = "禁止 IP";
	else if (id == 7) thegroup = "游客";
	else if (id == 8) thegroup = "等待验证会员";
	else if (id == 9) thegroup = "乞丐";
	else if (id == 10) thegroup = "新手上路";
	else if (id == 11) thegroup = "注册会员";
	else if (id == 12) thegroup = "中级会员";
	else if (id == 13) thegroup = "高级会员";
	else if (id == 14) thegroup = "金牌会员";
	else if (id == 15) thegroup = "论坛元老";
	else if (id == 17) thegroup = "贵宾";
	else if (id == 18) thegroup = "元老院";
	else if (id == 19) thegroup = "荣誉斑竹团";
	else if (id == 20) thegroup = "原创用户";
	else if (id == 21) thegroup = "荣誉管理员";
	else if (id == 22) thegroup = "html代码组";
	else if (id == 23) thegroup = "审核组";
	else if (id == 25) thegroup = "新闻编辑";
	else if (id == 26) thegroup = "音画管理员";
	else if (id == 28) thegroup = "辣评人";
	else if (id == 29) thegroup = "音画组";
	else if (id == 30) thegroup = "写手";
	else               thegroup = "新手上路";
	return thegroup
}

//显示军衔
function list_military_(military_id , military_style){
	var military_level;
	if (military_id == 22)      military_level = "军区参谋长";
	else if (military_id == 21)      military_level = "超级版主";
	else if (military_id == 20)      military_level = "版主";
	else if (military_id == 19)      military_level = "五星将军";
	else if (military_id == 18) military_level = "四星将军";
	else if (military_id == 17) military_level = "上将";
	else if (military_id == 16) military_level = "中将";
	else if (military_id == 15) military_level = "少将";
	else if (military_id == 14) military_level = "大校";
	else if (military_id == 13) military_level = "上校";
	else if (military_id == 12) military_level = "中校";
	else if (military_id == 11) military_level = "少校";
	else if (military_id == 10) military_level = "上尉";
	else if (military_id == 9)  military_level = "中尉";
	else if (military_id == 8)  military_level = "少尉";
	else if (military_id == 7)  military_level = "六级士官";
	else if (military_id == 6)  military_level = "五级士官";
	else if (military_id == 5)  military_level = "四级士官";
	else if (military_id == 4)  military_level = "三级士官";
	else if (military_id == 3)  military_level = "二级士官";
	else if (military_id == 2)  military_level = "一级士官";
	else if (military_id == 1)  military_level = "列兵";
	else            military_level = "";
	if (military_level){
		if (military_style == 1){
			document.write (military_level) ;
		} else if (military_style == 2){
			document.write ("<img src=\"images/military/"+military_id+".gif\" title=\""+military_level+"\" />") ;
		} else if (military_style == 3){
			document.write (military_level) ;
			document.write ("<img src=\"images/military/"+military_id+".gif\" title=\""+military_level+"\" />") ;
		}
	}
}

//ajax.js
var Ajaxs = new Array();
function Ajax(recvType, statusId) {
	var aj = new Object();
	aj.statusId = statusId ? document.getElementById(statusId) : null;
	aj.targetUrl = '';
	aj.sendString = '';
	aj.recvType = recvType ? recvType : 'XML';
	aj.resultHandle = null;

	aj.createXMLHttpRequest = function() {
		var request = false;
		if(window.XMLHttpRequest) {
			request = new XMLHttpRequest();
			if(request.overrideMimeType) {
				request.overrideMimeType('text/xml');
			}
		} else if(window.ActiveXObject) {
			var versions = ['Microsoft.XMLHTTP', 'MSXML.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.7.0', 'Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.5.0', 'Msxml2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP'];
			for(var i=0; i<versions.length; i++) {
				try {
					request = new ActiveXObject(versions[i]);
					if(request) {
						return request;
					}
				} catch(e) {
					//alert(e.message);
				}
			}
		}
		return request;
	}

	aj.XMLHttpRequest = aj.createXMLHttpRequest();

	aj.processHandle = function() {
		if(aj.statusId) {
			aj.statusId.style.display = '';
		}
		if(aj.XMLHttpRequest.readyState == 1 && aj.statusId) {
			aj.statusId.innerHTML = xml_http_building_link;
		} else if(aj.XMLHttpRequest.readyState == 2 && aj.statusId) {
			aj.statusId.innerHTML = xml_http_sending;
		} else if(aj.XMLHttpRequest.readyState == 3 && aj.statusId) {
			aj.statusId.innerHTML = xml_http_loading;
		} else if(aj.XMLHttpRequest.readyState == 4) {
			if(aj.XMLHttpRequest.status == 200) {
				for(k in Ajaxs) {
					if(Ajaxs[k] == aj.targetUrl) {
						Ajaxs[k] = null;
					}
				}

				if(aj.statusId) {
					aj.statusId.innerHTML = xml_http_data_in_processed;
					aj.statusId.style.display = 'none';
				}
				if(aj.recvType == 'HTML') {
					aj.resultHandle(aj.XMLHttpRequest.responseText, aj);
				} else if(aj.recvType == 'XML') {
					aj.resultHandle(aj.XMLHttpRequest.responseXML.lastChild.firstChild.nodeValue, aj);
				}
			} else {
				if(aj.statusId) {
					aj.statusId.innerHTML = xml_http_load_failed;
				}
			}
		}
	}

	aj.get = function(targetUrl, resultHandle) {
		if(in_array(targetUrl, Ajaxs)) {
			return false;
		} else {
			arraypush(Ajaxs, targetUrl);
		}
		aj.targetUrl = targetUrl;
		aj.XMLHttpRequest.onreadystatechange = aj.processHandle;
		aj.resultHandle = resultHandle;
		if(window.XMLHttpRequest) {
			aj.XMLHttpRequest.open('GET', aj.targetUrl);
			aj.XMLHttpRequest.send(null);
		} else {
			aj.XMLHttpRequest.open("GET", targetUrl, true);
			aj.XMLHttpRequest.send();
		}
	}

	aj.post = function(targetUrl, sendString, resultHandle) {
		if(in_array(targetUrl, Ajaxs)) {
			return false;
		} else {
			arraypush(Ajaxs, targetUrl);
		}
		aj.targetUrl = targetUrl;
		aj.sendString = sendString;
		aj.XMLHttpRequest.onreadystatechange = aj.processHandle;
		aj.resultHandle = resultHandle;
		aj.XMLHttpRequest.open('POST', targetUrl);
		aj.XMLHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		aj.XMLHttpRequest.send(aj.sendString);
	}
	return aj;
}

function ajaxmenu(e, ctrlid, timeout, func, cache) {
	if(jsmenu['active'][0] && jsmenu['active'][0].ctrlkey == ctrlid) {
		doane(e);
		return;
	} else if(is_ie && is_ie < 7 && document.readyState.toLowerCase() != 'complete') {
		return;
	}
	if(isUndefined(timeout)) timeout = 3000;
	if(isUndefined(func)) func = '';
	if(isUndefined(cache)) cache = 1;

	var div = $(ctrlid + '_menu');
	if(cache && div) {
		showMenu(ctrlid, true, 0, 0, timeout);
		if(func) setTimeout(func + '(' + ctrlid + ')', timeout);
		doane(e);
	} else {
		if(!div) {
			div = document.createElement('div');
			div.id = ctrlid + '_menu';
			div.style.display = 'none';
			div.className = 'popupmenu_popup';
			div.title = 'menu';
			document.body.appendChild(div);
		}
		var x = new Ajax();
		x.get($(ctrlid).href + '&inajax=1', function(s) {
			if(s.substr(0, 25) == '<div id="attackevasive_1"') {
				alert(String.fromCharCode(39057,32321,21047,26032,38480,21046) + '\n' + String.fromCharCode(24744,35775,38382,26412,31449,36895,24230,36807,24555,25110,32773,21047,26032,38388,38548,26102,38388,23567,20110,20004,31186,65281));
				return;
			}
			div.innerHTML = '<div class="popupmenu_option">' + s + '</div>';
			showMenu(ctrlid, true, 0, 0, timeout);
			if(func) setTimeout(func + '(' + ctrlid + ')', timeout);
			if(!cache) setTimeout('document.body.removeChild(' + div.id + ')', timeout);
		});
		doane(e);
	}
}

function updatesecqaa() {
	var x = new Ajax();
	x.get('ajax.php?action=updatesecqaa&inajax=1', function(s) {
		$('secquestion').innerHTML = s;
	});
}

function ignorepm(e) {
	var x = new Ajax();
	x.get('pm.php?action=noprompt&inajax=1', function(s) {
		$('pmprompt').style.display = 'none';
	});
	doane(e);
}

var presmtbl = 'smtbl_1';
function getSmilies(event) {
	if(!isUndefined(event)) {
		var obj = is_ie ? event.srcElement : event.target;
		var page = obj.href.replace(/.*\?page=(\d+)/ig, function($1, $2) {return $2;});
	} else {
		var page = getcookie('smpage');
	}
	setcookie('smpage', page, 86400 * 3);
	var currsmtbl = 'smtbl_' + page;
	if(!$(currsmtbl)) {
		var div = document.createElement('div');
		div.id = currsmtbl;
		$('smiliestable').appendChild(div);
		var x = new Ajax();
		x.get('post.php?action=smilies&inajax=1&page=' + page, function(s) {
			if(s.substr(0, 25) == '<div id="attackevasive_1"') {
				$('smiliestable').removeChild(div);
				alert(String.fromCharCode(39057,32321,21047,26032,38480,21046) + '\n' + String.fromCharCode(24744,35775,38382,26412,31449,36895,24230,36807,24555,25110,32773,21047,26032,38388,38548,26102,38388,23567,20110,20004,31186,65281));
				return;
			}
			if(presmtbl) $(presmtbl).style.display = 'none';
			div.innerHTML = s;
			presmtbl = currsmtbl;
		});
	} else {
		$(currsmtbl).style.display = '';
		if(presmtbl && presmtbl != currsmtbl) $(presmtbl).style.display = 'none';
		presmtbl = currsmtbl;
	}
}

function changestatus(obj) {
	if(obj.innerHTML == '隐身模式') {obj.innerHTML = '正常模式';	obj.title = '切换到隐身模式';}
	else {obj.innerHTML = '隐身模式';	obj.title = '切换到正常模式';}
}

//------------menu.js
var jsmenu = new Array();
jsmenu['active'] = new Array();
jsmenu['timer'] = new Array();
jsmenu['iframe'] = new Array();

function initCtrl(ctrlobj, click, duration, timeout, layer) {
	if(ctrlobj && !ctrlobj.initialized) {
		ctrlobj.initialized = true;
		ctrlobj.unselectable = true;

		ctrlobj.outfunc = typeof ctrlobj.onmouseout == 'function' ? ctrlobj.onmouseout : null;
		ctrlobj.onmouseout = function() {
			if(this.outfunc) this.outfunc();
			if(duration < 3) jsmenu['timer'][ctrlobj.id] = setTimeout('hideMenu(' + layer + ')', timeout);
		}

		if(click && duration) {
			ctrlobj.clickfunc = typeof ctrlobj.onclick == 'function' ? ctrlobj.onclick : null;
			ctrlobj.onclick = function (e) {
				doane(e);
				if(jsmenu['active'][layer] == null || jsmenu['active'][layer].ctrlkey != this.id) {
					if(this.clickfunc) this.clickfunc();
					else showMenu(this.id, true);
				} else {
					hideMenu(layer);
				}
			}
		}

		ctrlobj.overfunc = typeof ctrlobj.onmouseover == 'function' ? ctrlobj.onmouseover : null;
		ctrlobj.onmouseover = function(e) {
			doane(e);
			if(this.overfunc) this.overfunc();
			if(click) {
				clearTimeout(jsmenu['timer'][this.id]);
			} else {
				for(var id in jsmenu['timer']) {
					if(jsmenu['timer'][id]) clearTimeout(jsmenu['timer'][id]);
				}
			}
		}
	}
}

function initMenu(ctrlid, menuobj, duration, timeout, layer) {
	if(menuobj && !menuobj.initialized) {
		menuobj.initialized = true;
		menuobj.ctrlkey = ctrlid;
		menuobj.onclick = ebygum;
		menuobj.style.position = 'absolute';
		if(duration < 3) {
			if(duration > 1) {
				menuobj.onmouseover = function() {
					clearTimeout(jsmenu['timer'][ctrlid]);
				}
			}
			if(duration != 1) {
				menuobj.onmouseout = function() {
					jsmenu['timer'][ctrlid] = setTimeout('hideMenu(' + layer + ')', timeout);
				}
			}
		}
		menuobj.style.zIndex = 50;
		if(is_ie && !is_mac) {
			menuobj.style.filter += "progid:DXImageTransform.Microsoft.shadow(direction=135,color=#999999,strength=4)";
		}
		initMenuContents(menuobj);
	}
}

function initMenuContents(menuobj) {
	if(menuobj.title == 'menu') {
		menuobj.style.filter += "progid:DXImageTransform.Microsoft.Alpha(opacity=100,finishOpacity=100,style=0)";
		menuobj.style.opacity = 1;
		menuobj.title = '';
	} else {
		var tds = findtags(menuobj, 'td');
		for(var i = 0; i < tds.length; i++) {
			if(tds[i].className == 'popupmenu_option' || tds[i].className == 'editor_colornormal') {
				if(is_ie && !is_mac) {
					tds[i].style.filter += "progid:DXImageTransform.Microsoft.Alpha(opacity=100,finishOpacity=100,style=0)";
				}
				tds[i].style.opacity = 1;
				if(tds[i].title && tds[i].title == 'nohighlight') {
					tds[i].title = '';
				} else {
					tds[i].ctrlkey = this.ctrlkey;
					if(tds[i].className != 'editor_colornormal') {
						tds[i].onmouseover = menuoption_onmouseover;
						tds[i].onmouseout = menuoption_onmouseout;
					}
					if(typeof tds[i].onclick == 'function') {
						tds[i].clickfunc = tds[i].onclick;
						tds[i].onclick = menuoption_onclick_function;
					} else {
						tds[i].onclick = menuoption_onclick_link;
					}
					if(!is_saf && !is_kon)	{
						try {
							links = findtags(tds[i], 'a');
							for(var j = 0; j < links.length; j++) {
								if(isUndefined(links[j].onclick)) {
									links[j].onclick = ebygum;
								}
							}
						}
						catch(e) {}
					}
				}
			}
		}
	}
}

function showMenu(ctrlid, click, offset, duration, timeout, layer, showid, maxh) {
	var ctrlobj = $(ctrlid);
	if(!ctrlobj) return;
	if(isUndefined(click)) click = false;
	if(isUndefined(offset)) offset = 0;
	if(isUndefined(duration)) duration = 2;
	if(isUndefined(timeout)) timeout = 500;
	if(isUndefined(layer)) layer = 0;
	if(isUndefined(showid)) showid = ctrlid;
	var showobj = $(showid);
	var menuobj = $(showid + '_menu');
	if(!showobj|| !menuobj) return;
	if(isUndefined(maxh)) maxh = 600;

	hideMenu(layer);

	for(var id in jsmenu['timer']) {
		if(jsmenu['timer'][id]) clearTimeout(jsmenu['timer'][id]);
	}

	initCtrl(ctrlobj, click, duration, timeout, layer);
	initMenu(ctrlid, menuobj, duration, timeout, layer);

	menuobj.style.display = '';
	if(!is_opera) {
		menuobj.style.clip = 'rect(auto, auto, auto, auto)';
	}

	var showobj_pos = fetchOffset(showobj);
	var showobj_x = showobj_pos['left'];
	var showobj_y = showobj_pos['top'];
	var showobj_w = showobj.offsetWidth;
	var showobj_h = showobj.offsetHeight;
	var menuobj_w = menuobj.offsetWidth;
	var menuobj_h = menuobj.offsetHeight;

	menuobj.style.left = (showobj_x + menuobj_w > document.body.clientWidth) && (showobj_x + showobj_w - menuobj_w >= 0) ? showobj_x + showobj_w - menuobj_w + 'px' : showobj_x + 'px';
	menuobj.style.top = offset == 1 ? showobj_y + 'px' : (offset == 2 || ((showobj_y + showobj_h + menuobj_h > document.body.scrollTop + document.body.clientHeight) && (showobj_y - menuobj_h >= 0)) ? (showobj_y - menuobj_h) + 'px' : showobj_y + showobj_h + 'px');

	if(menuobj.style.clip && !is_opera) {
		menuobj.style.clip = 'rect(auto, auto, auto, auto)';
	}

	if(is_ie && is_ie < 7) {
		if(!jsmenu['iframe'][layer]) {
			var iframe = document.createElement('iframe');
			iframe.style.display = 'none';
			iframe.style.position = 'absolute';
			iframe.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';
			$('jsmenu_parent') ? $('jsmenu_parent').appendChild(iframe) : menuobj.parentNode.appendChild(iframe);
			jsmenu['iframe'][layer] = iframe;
		}
		jsmenu['iframe'][layer].style.top = menuobj.style.top;
		jsmenu['iframe'][layer].style.left = menuobj.style.left;
		jsmenu['iframe'][layer].style.width = menuobj_w;
		jsmenu['iframe'][layer].style.height = menuobj_h;
		jsmenu['iframe'][layer].style.display = 'block';
	}

	if(maxh && menuobj.scrollHeight > maxh) {
		menuobj.style.height = maxh + 'px';
		if(is_opera) {
			menuobj.style.overflow = 'auto';
		} else {
			menuobj.style.overflowY = 'auto';
		}
	}

	if(!duration) {
		setTimeout('hideMenu(' + layer + ')', timeout);
	}

	jsmenu['active'][layer] = menuobj;
}

//个人详细信息弹出框
function ajaxmenu_g(height_g, e, ctrlid, uid_js, avatarwidth_js, timeout, func, cache) {
	if(is_ie && is_ie < 7 && document.readyState.toLowerCase() != 'complete') {
		return;
	}
	if(isUndefined(timeout)) timeout = 500;
	if(isUndefined(func)) func = '';
	if(isUndefined(cache)) cache = 1;
	var div = $(ctrlid + '_menu');
	if(cache && div.innerHTML!="") {
		showMenu_g(height_g, ctrlid, false, 0, 0, timeout);
		doane(e);
	} else {
		var x = new Ajax();
		x.get('/grxx.php?uid=' + uid_js + '&width=' + avatarwidth_js + '&height=' + height_g + '&inajax=1', function(s) {
			if(s.substr(0, 25) == '<div id="attackevasive_1"') {
				alert(String.fromCharCode(39057,32321,21047,26032,38480,21046) + '\n' + String.fromCharCode(24744,35775,38382,26412,31449,36895,24230,36807,24555,25110,32773,21047,26032,38388,38548,26102,38388,23567,20110,20004,31186,65281));
				return;
			}
			div.innerHTML = s;
			showMenu_g(height_g, ctrlid, false, 0, 0, timeout);
			if(!cache) setTimeout('document.body.removeChild(' + div.id + ')', timeout);
		});
		doane(e);
	}
}

//个人详细信息弹出框
function showMenu_g(height_g, ctrlid, click, offset, duration, timeout, layer, showid, maxh) {
	var height_gg = height_g;
	var ctrlobj = $(ctrlid);
	if(!ctrlobj) return;
	if(isUndefined(click)) click = false;
	if(isUndefined(offset)) offset = 0;
	if(isUndefined(duration)) duration = 2;
	if(isUndefined(timeout)) timeout = 500;
	if(isUndefined(layer)) layer = 0;
	if(isUndefined(showid)) showid = ctrlid;
	var showobj = $(showid);
	var menuobj = $(showid + '_menu');
	if(!showobj|| !menuobj) return;
	if(isUndefined(maxh)) maxh = 600;
	
	hideMenu(layer);
	
	for(var id in jsmenu['timer']) {
		if(jsmenu['timer'][id]) clearTimeout(jsmenu['timer'][id]);
	}

	menuobj.style.display = '';
	if(!is_opera) {
		menuobj.style.clip = 'rect(auto, auto, auto, auto)';
	}

	var showobj_pos = fetchOffset(showobj);
	var showobj_x = showobj_pos['left'];
	var showobj_y = showobj_pos['top'];
	var showobj_w = showobj.offsetWidth;
	var showobj_h = showobj.offsetHeight;
	var menuobj_w = menuobj.offsetWidth;
	var menuobj_h = menuobj.offsetHeight;

	menuobj.style.left = (showobj_x + menuobj_w > document.body.clientWidth) && (showobj_x + showobj_w - menuobj_w >= 0) ? showobj_x + showobj_w - menuobj_w + 'px' : showobj_x - 6 + 'px';
	menuobj.style.top = offset == 1 ? showobj_y + 'px' : (offset == 2 || ((showobj_y + showobj_h + menuobj_h > document.body.scrollTop + document.body.clientHeight) && (showobj_y - menuobj_h >= 0)) ? (showobj_y - menuobj_h) + 'px' : showobj_y + showobj_h -height_gg - 10 + 'px')

	if(menuobj.style.clip && !is_opera) {
		menuobj.style.clip = 'rect(auto, auto, auto, auto)';
	}

	if(is_ie && is_ie < 7) {
		if(!jsmenu['iframe'][layer]) {
			var iframe = document.createElement('iframe');
			iframe.style.display = 'none';
			iframe.style.position = 'absolute';
			iframe.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';
			$('jsmenu_parent') ? $('jsmenu_parent').appendChild(iframe) : menuobj.parentNode.appendChild(iframe);
			jsmenu['iframe'][layer] = iframe;
		}
		jsmenu['iframe'][layer].style.top = menuobj.style.top;
		jsmenu['iframe'][layer].style.left = menuobj.style.left;
		jsmenu['iframe'][layer].style.width = menuobj_w;
		jsmenu['iframe'][layer].style.height = menuobj_h;
		jsmenu['iframe'][layer].style.display = 'block';
	}
	

	jsmenu['active'][layer] = menuobj;
}

//显示级别
function ajaxmenu_jb(e, ctrlid, timeout, uid_jb, func, cache) {
	if(is_ie && is_ie < 7 && document.readyState.toLowerCase() != 'complete') {
		return;
	}
	if(isUndefined(timeout)) timeout = 500;
	if(isUndefined(func)) func = '';
	if(isUndefined(cache)) cache = 1;

	var div = $(ctrlid + '_menu');
	if(cache && div.innerHTML!="") {
		showMenu_jb(ctrlid, true, 0, 0, timeout);
		doane(e);
	} else {
		var x = new Ajax();
		x.get('threadplus.php?mod=dj&uid=' + uid_jb + '&inajax=1', function(s) {
			if(s.substr(0, 25) == '<div id="attackevasive_1"') {
				alert(String.fromCharCode(39057,32321,21047,26032,38480,21046) + '\n' + String.fromCharCode(24744,35775,38382,26412,31449,36895,24230,36807,24555,25110,32773,21047,26032,38388,38548,26102,38388,23567,20110,20004,31186,65281));
				return;
			}
			div.innerHTML = '<div class="crly">' + s + '</div><div class="mncr"></div>';
			showMenu_jb(ctrlid, true, 0, 0, timeout);
			if(func) setTimeout(func + '(' + ctrlid + ')', timeout);
			if(!cache) setTimeout('document.body.removeChild(' + div.id + ')', timeout);
		});
		doane(e);
	}
}

//级别弹出框
function showMenu_jb(ctrlid, click, offset, duration, timeout, layer, showid, maxh) {
	var ctrlobj = $(ctrlid);
	if(!ctrlobj) return;
	if(isUndefined(click)) click = false;
	if(isUndefined(offset)) offset = 0;
	if(isUndefined(duration)) duration = 2;
	if(isUndefined(timeout)) timeout = 500;
	if(isUndefined(layer)) layer = 0;
	if(isUndefined(showid)) showid = ctrlid;
	var showobj = $(showid);
	var menuobj = $(showid + '_menu');
	if(!showobj|| !menuobj) return;
	if(isUndefined(maxh)) maxh = 600;

	hideMenu(layer);

	for(var id in jsmenu['timer']) {
		if(jsmenu['timer'][id]) clearTimeout(jsmenu['timer'][id]);
	}

	initCtrl(ctrlobj, click, duration, timeout, layer);
	initMenu(ctrlid, menuobj, duration, timeout, layer);

	menuobj.style.display = '';
	if(!is_opera) {
		menuobj.style.clip = 'rect(auto, auto, auto, auto)';
	}

	var showobj_pos = fetchOffset(showobj);
	var showobj_x = showobj_pos['left'];
	var showobj_y = showobj_pos['top'];
	var showobj_w = showobj.offsetWidth;
	var showobj_h = showobj.offsetHeight;
	var menuobj_w = menuobj.offsetWidth;
	var menuobj_h = menuobj.offsetHeight;

	menuobj.style.left = (showobj_x + menuobj_w > document.body.clientWidth) && (showobj_x + showobj_w - menuobj_w >= 0) ? showobj_x + showobj_w - menuobj_w + 'px' : showobj_x + 'px';
	menuobj.style.top = offset == 1 ? showobj_y + 'px' : (offset == 2 || ((showobj_y + showobj_h + menuobj_h > document.body.scrollTop + document.body.clientHeight) && (showobj_y - menuobj_h >= 0)) ? (showobj_y - menuobj_h) + 'px' : showobj_y + showobj_h - 54 + 'px');

	if(menuobj.style.clip && !is_opera) {
		menuobj.style.clip = 'rect(auto, auto, auto, auto)';
	}

	if(is_ie && is_ie < 7) {
		if(!jsmenu['iframe'][layer]) {
			var iframe = document.createElement('iframe');
			iframe.style.display = 'none';
			iframe.style.position = 'absolute';
			iframe.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';
			$('jsmenu_parent') ? $('jsmenu_parent').appendChild(iframe) : menuobj.parentNode.appendChild(iframe);
			jsmenu['iframe'][layer] = iframe;
		}
		jsmenu['iframe'][layer].style.top = menuobj.style.top;
		jsmenu['iframe'][layer].style.left = menuobj.style.left;
		jsmenu['iframe'][layer].style.width = menuobj_w;
		jsmenu['iframe'][layer].style.height = menuobj_h;
		jsmenu['iframe'][layer].style.display = 'block';
	}
	jsmenu['active'][layer] = menuobj;
}

function hideMenu_g(e,o) {
	/* FF 下判断鼠标是否离开DIV */
	if(window.navigator.userAgent.indexOf("Firefox")>=1) {
		var x = e.clientX + getScrollXY().x;
		var y = e.clientY + getScrollXY().y;
		var left = o.offsetLeft;
		var top = o.offsetTop;
		var w = o.offsetWidth;
		var h = o.offsetHeight;


		if(y < top || y > (h + top) || x > left + w || x<left ) {
			o.style.display = 'none';
		}

	}

	/* IE */
	if(o.contains(event.toElement ) == false)
	o.style.display = 'none';

}

function getScrollXY(){
	var x,y;
	if(document.body.scrollTop){
		x=document.body.scrollLeft;
		y=document.body.scrollTop;
	}
	else{
		x=document.documentElement.scrollLeft;
		y=document.documentElement.scrollTop;
	}
	return {x:x,y:y};
}

function hideMenu(layer) {
	if(isUndefined(layer)) layer = 0;
	if(jsmenu['active'][layer]) {
		clearTimeout(jsmenu['timer'][jsmenu['active'][layer].ctrlkey]);
		jsmenu['active'][layer].style.display = 'none';
		if(is_ie && is_ie < 7 && jsmenu['iframe'][layer]) {
			jsmenu['iframe'][layer].style.display = 'none';
		}
		jsmenu['active'][layer] = null;
	}
}

function fetchOffset(obj) {
	var left_offset = obj.offsetLeft;
	var top_offset = obj.offsetTop;
	while((obj = obj.offsetParent) != null) {
		left_offset += obj.offsetLeft;
		top_offset += obj.offsetTop;
	}
	return { 'left' : left_offset, 'top' : top_offset };
}

function ebygum(eventobj) {
	if(!eventobj || is_ie) {
		window.event.cancelBubble = true;
		return window.event;
	} else {
		if(eventobj.target.type == 'submit') {
			eventobj.target.form.submit();
		}
		eventobj.stopPropagation();
		return eventobj;
	}
}

function menuoption_onclick_function(e) {
	this.clickfunc();
	hideMenu();
}

function menuoption_onclick_link(e) {
	choose(e, this);
}

function menuoption_onmouseover(e) {
	this.className = 'popupmenu_highlight';
}

function menuoption_onmouseout(e) {
	this.className = 'popupmenu_option';
}

function choose(e, obj) {
	var links = findtags(obj, 'a');
	if(links[0]) {
		if(is_ie) {
			links[0].click();
			window.event.cancelBubble = true;
		} else {
			if(e.shiftKey) {
				window.open(links[0].href);
				e.stopPropagation();
				e.preventDefault();
			} else {
				window.location = links[0].href;
				e.stopPropagation();
				e.preventDefault();
			}
		}
		hideMenu();
	}
}

//bbcode.js
var re;
var pcodecount = '-1';
var codecount = 0;
var codehtml = new Array();

function addslashes(str) {
	return preg_replace(['\\\\', '\\\'', '\\\/', '\\\(', '\\\)', '\\\[', '\\\]', '\\\{', '\\\}', '\\\^', '\\\$', '\\\?', '\\\.', '\\\*', '\\\+', '\\\|'], ['\\\\', '\\\'', '\\/', '\\(', '\\)', '\\[', '\\]', '\\{', '\\}', '\\^', '\\$', '\\?', '\\.', '\\*', '\\+', '\\|'], str);
}

function atag(aoptions, text) {
	if(trim(text) == '') {
		return '';
	}

	href = getoptionvalue('href', aoptions);

	if(href.substr(0, 11) == 'javascript:') {
		return trim(recursion('a', text, 'atag'));
	} else if(href.substr(0, 7) == 'mailto:') {
		tag = 'email';
		href = href.substr(7);
	} else {
		tag = 'url';
	}

	return '[' + tag + '=' + href + ']' + trim(recursion('a', text, 'atag')) + '[/' + tag + ']';
}

function bbcode2html(str,htmlon) {
	str = trim(str);
	if(str == '') {
		return '';
	}
	allowbbcode = 1;
	forumallowhtml = 1;
	allowhtml =1;
	allowimgcode =1;
	if(htmlon!=1) forumallowhtml=0;

	if(!fetchCheckbox('bbcodeoff') && allowbbcode) {
		str= str.replace(/\s*\[code\]([\s\S]+?)\[\/code\]\s*/ig, function($1, $2) {return parsecode($2);});
	}

	if(!forumallowhtml && !(allowhtml && fetchCheckbox('htmlon'))) {
		str = str.replace(/</g, '&lt;');
		str = str.replace(/>/g, '&gt;');
		/*
		if(!fetchCheckbox('parseurloff')) {
			str = parseurl(str, 'html');
		}
		*/
	}

/*
	if(!fetchCheckbox('smileyoff') && allowsmilies) {
		for(id in smilies) {
			re = new RegExp(addslashes(smilies[id]['code']), "g");
			str = str.replace(re, '<img src="./images/smilies/' + smilies[id]['url'] + '" border="0" smilieid="' + id + '" alt="' + smilies[id]['code'] + '" />');
		}
	}
*/


	if(!fetchCheckbox('bbcodeoff') && allowbbcode) {
		str= str.replace(/\[url\]\s*(www.|https?:\/\/|ftp:\/\/|gopher:\/\/|news:\/\/|telnet:\/\/|rtsp:\/\/|mms:\/\/|callto:\/\/|bctp:\/\/|ed2k:\/\/){1}([^\[\"']+?)\s*\[\/url\]/ig, function($1, $2, $3) {return cuturl($2 + $3);});
		str= str.replace(/\[url=www.([^\[\"']+?)\](.+?)\[\/url\]/ig, '<a href="http://www.$1" target="_blank">$2</a>');
		str= str.replace(/\[url=(https?|ftp|gopher|news|telnet|rtsp|mms|callto|bctp|ed2k){1}:\/\/([^\[\"']+?)\]([\s\S]+?)\[\/url\]/ig, '<a href="$1://$2" target="_blank">$3</a>');
		str= str.replace(/\[email\](.*?)\[\/email\]/ig, '<a href="mailto:$1">$1</a>');
		str= str.replace(/\[email=(.[^\[]*)\](.*?)\[\/email\]/ig, '<a href="mailto:$1" target="_blank">$2</a>');
		str = str.replace(/\[color=([^\[\<]+?)\]/ig, '<font color="$1">');
		str = str.replace(/\[size=(\d+?)\]/ig, '<font size="$1">');
		str = str.replace(/\[size=(\d+(\.\d+)?(px|pt|in|cm|mm|pc|em|ex|%)+?)\]/ig, '<font style="font-size: $1">');
		str = str.replace(/\[font=([^\[\<]+?)\]/ig, '<font face="$1">');
		str = str.replace(/\[face=([^\[\<]+?)\]/ig, '<font face="$1">');
		str = str.replace(/\[align=([^\[\<]+?)\]/ig, '<p align="$1">');
		str = str.replace(/\[float=([^\[\<]+?)\]/ig, '<br style="clear: both"><span style="float: $1;">');
		str = str.replace(/\[newem([0-9]+)\.([0-9]+)\]/ig, '<img src="images/smilies/$1/$2.gif" smiliecode="[newem$1.$2]" />');  //表情
		str = str.replace(/\[glow=([0-9]*),(#?[a-z0-9]*),([0-9]*)\]([^\[]*)\[\/glow\]/ig, '<table width=300 style="filter:glow(color=$2, strength=$3)"><tr><td>$4</td></tr></table>'); //shadow,glow
		str = str.replace(/\[shadow=([0-9]*),(#?[a-z0-9]*),([0-9]*)\]([^\[]*)\[\/shadow\]/ig, '<table width=300 style="filter:shadow(color=$2, strength=$3)"><tr><td>$4</td></tr></table>'); 

//add by system
str = str.replace(/\[fly](.+?)\[\/fly\]/ig, '<marquee width="90%" behavior="alternate" scrollamount="3">$1</marquee>');
str = str.replace(/\[flash](.+?)\[\/flash\]/ig, '<a target="_blank" href="$1"><img alt="" src="images/common/bb_flash.gif" border="0" dypop="点击开新窗口欣赏该FLASH动画!">[全屏欣赏]</a><br /><object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" width="550" height="400"><param name="allowScriptAccess" value="sameDomain"><param name="movie" value="$1"><param name="quality" value="high"><param name="bgcolor" value="#ffffff"><embed src="$1" quality="high" bgcolor="#ffffff" width="550" height="400" allowScriptAccess="sameDomain" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" /></object>');
str = str.replace(/\[flash=(.+?),(.+?)\](.+?)\[\/flash\]/ig, '<a target="_blank" href="$3"><img alt="" src="images/common/bb_flash.gif" border="0" dypop="点击开新窗口欣赏该FLASH动画!">[全屏欣赏]</a><br /><object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" width="$1" height="$2"><param name="allowScriptAccess" value="sameDomain"><param name="movie" value="$3"><param name="quality" value="high"><param name="bgcolor" value="#ffffff"><embed src="$3" quality="high" bgcolor="#ffffff" width="$1" height="$2" allowScriptAccess="sameDomain" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" /></object>');
str = str.replace(/\[ra](.+?)\[\/ra\]/ig, '<a target="_blank" href="$1"><img src="images/common/bb_ra.gif" border="0">[下载地址]</a><br /><object classid="clsid:CFCDAA03-8BE4-11CF-B84B-0020AFBBCCFA" width="400" height="30"><param name="src" value="$1" /><param name="controls" value="controlpanel" /><param name="console" value="_$1" /><embed src="$1" type="audio/x-pn-realaudio-plugin" console="_$1" controls="ControlPanel" width="400" height="30"></embed></object>');
str = str.replace(/\[ra=(.+?),(.+?)\](.+?)\[\/ra\]/ig, '<a target="_blank" href="$3"><img src="images/common/bb_ra.gif" border="0">[下载地址]</a><br /><object classid="clsid:CFCDAA03-8BE4-11CF-B84B-0020AFBBCCFA" width="$1" height="$2"><param name="src" value="$3" /><param name="controls" value="controlpanel" /><param name="console" value="_$3" /><embed src="$3" type="audio/x-pn-realaudio-plugin" console="_$3" controls="ControlPanel" width="$1" height="$2"></embed></object>');
str = str.replace(/\[rm](.+?)\[\/rm\]/ig, '<a target="_blank" href="$1"><img src="images/common/bb_rm.gif" border="0">[下载地址]</a><br /><object classid="clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA" width="480" height="360"><param name="src" value="$1" /><param name="controls" value="imagewindow" /><param name="console" value="_$1" /><embed src="$1" type="audio/x-pn-realaudio-plugin" controls="IMAGEWINDOW" console="_$1" width="480" height="360" autostart="true"  autostart="true" ></embed></object><br /><object classid="CLSID:CFCDAA03-8BE4-11CF-B84B-0020AFBBCCFA" width="480" height="32"><param name="src" value="$1" /><param name="controls" value="controlpanel" /><param name="console" value="_$1" /><embed src="$1" type="audio/x-pn-realaudio-plugin" controls="ControlPanel" console="_$1" width="480" height="32"></embed></object><br />');
str = str.replace(/\[rm=(.+?),(.+?)\](.+?)\[\/rm\]/ig, '<a target="_blank" href="$3"><img src="images/common/bb_rm.gif" border="0">[下载地址]</a><br /><object classid="clsid:CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA" width="$1" height="$2"><param name="src" value="$3" /><param name="controls" value="imagewindow" /><param name="console" value="_$3" /><embed src="$3" type="audio/x-pn-realaudio-plugin" controls="IMAGEWINDOW" console="_$3" width="$1" height="$2" autostart="true"  autostart="true" ></embed></object><br /><object classid="CLSID:CFCDAA03-8BE4-11CF-B84B-0020AFBBCCFA" width="$1" height="32"><param name="src" value="$3" /><param name="controls" value="controlpanel" /><param name="console" value="_$3" /><embed src="$3" type="audio/x-pn-realaudio-plugin" controls="ControlPanel" console="_$3" width="$1" height="32"></embed></object><br />');
str = str.replace(/\[wma](.+?)\[\/wma\]/ig, '<a target="_blank" href="$1"><img src="images/common/bb_wma.gif" border="0">[下载地址]</a><br /><object classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6" width="260" height="64"><param name="autostart" value="1" /><param name="url" value="$1" /><embed src="$1" autostart="0" type="video/x-ms-wmv" width="260" height="42"></embed></object>');
str = str.replace(/\[wma=(.+?),(.+?)\](.+?)\[\/wma\]/ig, '<a target="_blank" href="$3"><img src="images/common/bb_wma.gif" border="0">[下载地址]</a><br /><object classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6" width="$1" height="$2"><param name="autostart" value="1" /><param name="url" value="$3" /><embed src="$3" autostart="1" type="video/x-ms-wmv" width="$1" height="$2"></embed></object>');
str = str.replace(/\[wmv](.+?)\[\/wmv\]/ig, '<a target="_blank" href="$1"><img src="images/common/bb_wmv.gif" border="0">[下载地址]</a><br /><object classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6" width="500" height="400"><param name="autostart" value="1" /><param name="url" value="$1" /><embed src="$1" autostart="0" type="video/x-ms-wmv" width="500" height="400"></embed></object>');
str = str.replace(/\[wmv=(.+?),(.+?)\](.+?)\[\/wmv\]/ig, '<a target="_blank" href="$3"><img src="images/common/bb_wmv.gif" border="0">[下载地址]</a><br /><object classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6" width="$1" height="$2"><param name="autostart" value="1" /><param name="url" value="$3" /><embed src="$3" autostart="0" type="video/x-ms-wmv" width="$1" height="$2"></embed></object>');
str = str.replace(/\[mp=(.+?),(.+?)\](.+?)\[\/mp\]/ig, '<a target="_blank" href="$3"><img src="images/common/bb_wma.gif" border="0">[下载地址]</a><br /><object classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6" width="$1" height="$2"><param name="autostart" value="1" /><param name="url" value="$3" /><embed src="$3" autostart="1" type="video/x-ms-wmv" width="$1" height="$2"></embed></object>');
str = str.replace(/\[sound\](.+?)\[\/sound\]/ig, '<a href="$1" target=_blank><IMG SRC=images/common/bb_wma.gif border=0 alt="背景音乐"></a><bgsound src="$1" loop="-1">');

//for image url change
//str = str.replace("UploadFile","http://hsbbs.hnol.net/Upload_11_File"); 
//str = str.replace("/UploadFile","http://hsbbs.hnol.net/Upload_11_File");  
str = str.replace('http://bbs.hnol.net/UploadFile','http://hsbbs.hnol.net/Upload_11_File');
str = str.replace('http://bbs.hnol.net/bbsimg/','http://img2.hnol.net/bbsimg222/');
str = str.replace('http://image.hnol.net/a/','http://image.hnol.net/aa1/');
str = str.replace('http://bbs.hnol.net/theimg/','http://img2.hnol.net/the11img/');
str = str.replace('http://img.hnol.net/img/','http://img.hnol.net/theimg11/');
//end

		re = /\[table(?:=(\d{1,4}%?)(?:,([\(\)%,#\w ]+))?)?\]\s*([\s\S]+?)\s*\[\/table\]/ig;
		for (i = 0; i < 4; i++) {
			str = str.replace(re, function($1, $2, $3, $4) {return parsetable($2, $3, $4);});
		}

		str = preg_replace([
			'\\\[\\\/color\\\]', '\\\[\\\/size\\\]', '\\\[\\\/font\\\]', '\\\[\\\/face\\\]', '\\\[\\\/align\\\]', '\\\[b\\\]', '\\\[\\\/b\\\]',
			'\\\[i\\\]', '\\\[\\\/i\\\]', '\\\[u\\\]', '\\\[\\\/u\\\]', '\\\[list\\\]', '\\\[list=1\\\]', '\\\[list=a\\\]',
			'\\\[list=A\\\]', '\\\[\\\*\\\]', '\\\[\\\/list\\\]', '\\\[indent\\\]', '\\\[\\\/indent\\\]', '\\\[\\\/float\\\]',
			
			'\\\[center\\\]','\\\[\\\/center\\\]','\\\[quote\\\]','\\\[\\\/quote\\\]'
			], [
			'</font>', '</font>', '</font>', '</font>', '</p>', '<b>', '</b>', '<i>',
			'</i>', '<u>', '</u>', '<ul>', '<ul type=1>', '<ul type=a>',
			'<ul type=A>', '<li>', '</ul>', '<blockquote>', '</blockquote>', '</span>',
				
			'<center>','</center>','<br><div class="msgbody"><div class="msgheader"></div><div class="msgborder">','</div></div><br>'
			], str);
	}

	if(!fetchCheckbox('bbcodeoff')) {
		if(allowimgcode) {
			str = str.replace(/\[localimg=(\d{1,4}),(\d{1,4})\](\d+)\[\/localimg\]/ig, function ($1, $2, $3, $4) {if($('attach_' + $4)) {var src = $('attach_' + $4).value; if(src != '') return '<img style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=\'scale\',src=\'' + src + '\');width:' + $2 + ';height=' + $3 + '" src=\'images/common/none.gif\' border="0" aid="attach_' + $4 + '" alt="" />';}});
			str = str.replace(/\[img\]\s*([^\[\<\r\n]+?)\s*\[\/img\]/ig, '<a href="$1" target="_blank"><img src="$1" border="0" onload="if(this.width>screen.width*0.7) this.width=screen.width*0.7;" onmouseover="if(this.width>screen.width*0.7) this.width=screen.width*0.7;" onmousewheel="return imgzoom(this);" title="按此在新窗口浏览图片" /></a>');
			str = str.replace(/\[attachimg\](\d+)\[\/attachimg\]/ig, function ($1, $2) {eval('var attachimgurl = attachimgurl_' + $2);return '<img src="' + attachimgurl[0] + '" border="0" aid="attachimg_' + $2 + '" width="' + attachimgurl[1] + '" alt="" />';});
			str = str.replace(/\[img=(\d{1,4})[x|\,](\d{1,4})\]\s*([^\[\<\r\n]+?)\s*\[\/img\]/ig, '<a href="$3" target="_blank"><img  width="$1" height="$2" src="$3" border="0" onload="if(this.width>screen.width*0.7) this.width=screen.width*0.7;" onmouseover="if(this.width>screen.width*0.7) this.width=screen.width*0.7;" onmousewheel="return imgzoom(this);" title="按此在新窗口浏览图片" /></a>');
			str = str.replace(/\[upload[^\]]*]\s*([^\[\<\r\n]+?)\s*\[\/upload\]/ig, '<a href="$1" target="_blank"><img src="$1" border="0" style="cursor:pointer" onload="if(this.width>screen.width*0.7) this.width=screen.width*0.7;" onmouseover="if(this.width>screen.width*0.7) this.width=screen.width*0.7;" onclick="window.open(this.src);" onmousewheel="return imgzoom(this);" title="按此在新窗口浏览图片" />');
		} else {
			str = str.replace(/\[img\]\s*([^\[\<\r\n]+?)\s*\[\/img\]/ig, '$1');
			str = str.replace(/\[img=(\d{1,4})[x|\,](\d{1,4})\]\s*([^\[\<\r\n]+?)\s*\[\/img\]/ig, '$1');
			str = str.replace(/\[upload[^\]]*]\s*([^\[\<\r\n]+?)\s*\[\/upload\]/ig, '$1');
		}
	}

	for(var i = 0; i <= pcodecount; i++) {
		str = str.replace("[\tDISCUZ_CODE_" + i + "\t]", codehtml[i]);
	}

	if(1 || !forumallowhtml && !(allowhtml && fetchCheckbox('htmlon'))) { 
		//str = preg_replace(['\t', '   ', '  ', '(\r\n|\n|\r)'], ['&nbsp; &nbsp; &nbsp; &nbsp; ', '&nbsp; &nbsp;', '&nbsp;&nbsp;', '<br />'], str);
		str = preg_replace(['(\r\n|\n|\r)'], ['<br />'], str);
	}

	return str;
}

function codetag(text) {
	pcodecount++;
	text = text.replace(/<br[^\>]*>/ig, '\n');
	text = text.replace(/^[\n\r]*([\s\S]+?)[\n\r]*$/ig, '$1');
	text = text.replace(/<(\/|)[A-Za-z].*?>/ig, '');
	codehtml[pcodecount] = '[code]' + text + '[/code]';
	codecount++;
	return '[\tDISCUZ_CODE_' + pcodecount + '\t]';
}

function cuturl(url) {
	var length = 65;
	var urllink = '<a href="' + (url.toLowerCase().substr(0, 4) == 'www.' ? 'http://' + url : url) + '" target="_blank">';
	if(url.length > length) {
		url = url.substr(0, parseInt(length * 0.5)) + ' ... ' + url.substr(url.length - parseInt(length * 0.3));
	}
	urllink += url + '</a>';
	return urllink;
}

function dpstag(options, text, tagname) {
	if(trim(text) == '') {
		return '\n';
	}
	var pend = parsestyle(options, '', '');
	var prepend = pend['prepend'];
	var append = pend['append'];
	if(in_array(tagname, ['div', 'p'])) {
		align = getoptionvalue('align', options);
		if(in_array(align, ['left', 'center', 'right'])) {
			prepend = '[align=' + align + ']' + prepend;
			append += '[/align]';
		} else {
			append += '\n';
		}
	}
	return prepend + recursion(tagname, text, 'dpstag') + append;
}

function fetchoptionvalue(option, text) {
	if((position = strpos(text, option)) !== false) {
		delimiter = position + option.length;
		if(text.charAt(delimiter) == '"') {
			delimchar = '"';
		} else if(text.charAt(delimiter) == '\'') {
			delimchar = '\'';
		} else {
			delimchar = ' ';
		}
		delimloc = strpos(text, delimchar, delimiter + 1);
		if(delimloc === false) {
			delimloc = text.length;
		} else if(delimchar == '"' || delimchar == '\'') {
			delimiter++;
		}
		return trim(text.substr(delimiter, delimloc - delimiter));
	} else {
		return '';
	}
}

function fonttag(fontoptions, text) {
	var prepend = '';
	var append = '';
	var tags = new Array();
	tags = {'font' : 'face=', 'size' : 'size=', 'color' : 'color='};
	for(bbcode in tags) {
		optionvalue = fetchoptionvalue(tags[bbcode], fontoptions);
		if(optionvalue) {
			prepend += '[' + bbcode + '=' + optionvalue + ']';
			append = '[/' + bbcode + ']' + append;
		}
	}

	var pend = parsestyle(fontoptions, prepend, append);
	return pend['prepend'] + recursion('font', text, 'fonttag') + pend['append'];
}

function getoptionvalue(option, text) {
	re = new RegExp(option + "(\s+?)?\=(\s+?)?[\"']?(.+?)([\"']|$|>)", "ig");
	var matches = re.exec(text);
	if(matches != null) {
		return trim(matches[3]);
	}
	return '';
}

function html2bbcode(str) {

	if(forumallowhtml || (allowhtml && fetchCheckbox('htmlon')) || trim(str) == '') {
		str = str.replace(/<img([^>]*aid=[^>]*)>/ig, function($1, $2) {return imgtag($2);});
		return str;
	}

	str= str.replace(/\s*\[code\]([\s\S]+?)\[\/code\]\s*/ig, function($1, $2) {return codetag($2);});

	str = preg_replace(['<style.*?>[\\\s\\\S]*?<\/style>', '<script.*?>[\\\s\\\S]*?<\/script>', '<noscript.*?>[\\\s\\\S]*?<\/noscript>', '<select.*?>[\s\S]*?<\/select>', '<object.*?>[\s\S]*?<\/object>', '<!--[\\\s\\\S]*?-->', 'on[a-zA-Z]{3,16}\\\s?=\\\s?"[\\\s\\\S]*?"'], '', str);

	str= str.replace(/(\r\n|\n|\r)/ig, '');

	str= trim(str.replace(/&((#(32|127|160|173))|shy|nbsp);/ig, ' '));

	if(!fetchCheckbox('parseurloff')) {
		str = parseurl(str, 'bbcode');
	}

	if(!fetchCheckbox('bbcodeoff') && allowbbcode) {
		str = preg_replace(['<table([^>]*(width|background|background-color|bgcolor)[^>]*)>', '<table[^>]*>', '<tr[^>]*(?:background|background-color|bgcolor)[:=]\\\s*(["\']?)([\(\)%,#\\\w]+)(\\1)[^>]*>', '<tr[^>]*>', '<td([^>]*(width|colspan|rowspan)[^>]*)>', '<td[^>]*>', '<\/td>', '<\/tr>', '<\/table>'], [function($1, $2) {return tabletag($2);}, '[table]', function($1, $2, $3) {return '[tr=' + $3 + ']';}, '[tr]', function($1, $2) {return tdtag($2);}, '[td]', '[/td]', '[/tr]', '[/table]'], str);
	
		str = str.replace(/<h([0-9]+)[^>]*>(.*)<\/h\\1>/ig, "[size=$1]$2[/size]\n\n");
		str = str.replace(/<img[^>]+smiliecode="([^>"]+)"[^>]*>/ig, '$1'); //表情
		str = str.replace(/<img[^>]+smilieid=(["']?)(\d+)(\1)[^>]*>/ig, function($1, $2, $3) {return smilies[$3]['code'];});
		str = str.replace(/<img([^>]*src[^>]*)>/ig, function($1, $2) {return imgtag($2);});
		str = str.replace(/<a\s+?name=(["']?)(.+?)(\1)[\s\S]*?>([\s\S]*?)<\/a>/ig, '$4');
		str = str.replace(/<br\s+?style=(["']?)clear: both;?(\1)[^\>]*>/ig, '');
		str = str.replace(/<br[^\>]*>/ig, "\n");
	
		str = recursion('b', str, 'simpletag', 'b');
		str = recursion('strong', str, 'simpletag', 'b');
		str = recursion('i', str, 'simpletag', 'i');
		str = recursion('em', str, 'simpletag', 'i');
		str = recursion('u', str, 'simpletag', 'u');
		str = recursion('a', str, 'atag');
		str = recursion('font', str, 'fonttag');
		str = recursion('blockquote', str, 'simpletag', 'indent');
		str = recursion('ol', str, 'listtag');
		str = recursion('ul', str, 'listtag');
		str = recursion('div', str, 'dpstag');
		str = recursion('p', str, 'dpstag');
		str = recursion('span', str, 'dpstag');
	}

	str = str.replace(/<[\/\!]*?[^<>]*?>/ig, '');

	for(var i = 0; i <= pcodecount; i++) {
		str = str.replace("[\tDISCUZ_CODE_" + i + "\t]", codehtml[i]);
	}

	return preg_replace(['&amp;', '&nbsp;', '&lt;', '&gt;'], ['&', ' ', '<', '>'], str);
}

function htmlspecialchars(str) {
	return preg_replace([(is_mac && is_ie ? '&' : '&(?!#[0-9]+;)'), '<', '>', '"'], ['&amp;', '&lt;', '&gt;', '&quot;'], str);
}

function imgtag(attributes) {
	var width = '';
	var height = '';

	re = /src=(["']?)([\s\S]*?)(\1)/i;
	var matches = re.exec(attributes);
	if(matches != null) {
		var src = matches[2];
	} else {
		return '';
	}

	re = /width\s?:\s?(\d{1,4})px/ig;
	var matches = re.exec(attributes);
	if(matches != null) {
		width = matches[1];
	}

	re = /height\s?:\s?(\d{1,4})px/ig;
	var matches = re.exec(attributes);
	if(matches != null) {
		height = matches[1];
	}

	if(!width || !height) {
		re = /width=(["']?)(\d+)(\1)/i;
		var matches = re.exec(attributes);
		if(matches != null) {
			width = matches[2];
		}

		re = /height=(["']?)(\d+)(\1)/i;
		var matches = re.exec(attributes);
		if(matches != null) {
			height = matches[2];
		}
	}

	re = /aid=(["']?)attach_(\d+)(\1)/i;
	var matches = re.exec(attributes);
	var imgtag = 'img';
	if(matches != null) {
		imgtag = 'localimg';
		src = matches[2];
	}
	re = /aid=(["']?)attachimg_(\d+)(\1)/i;
	var matches = re.exec(attributes);
	if(matches != null) {
		return '[attachimg]' + matches[2] + '[/attachimg]';
	}
	return width > 0 && height > 0 ?
		'[' + imgtag + '=' + width + ',' + height + ']' + src + '[/' + imgtag + ']' :
		'[img]' + src + '[/img]';
}

function listtag(listoptions, text, tagname) {
	text = text.replace(/<li>(([\s\S](?!<\/li))*?)(?=<\/?ol|<\/?ul|<li|\[list|\[\/list)/ig, '<li>$1</li>') + (is_opera ? '</li>' : '');
	text = recursion('li', text, 'litag');
	var opentag = '[list]';
	var listtype = fetchoptionvalue('type=', listoptions);
	listtype = listtype != '' ? listtype : (tagname == 'ol' ? '1' : '');
	if(in_array(listtype, ['1', 'a', 'A'])) {
		opentag = '[list=' + listtype + ']';
	}
	return text ? opentag + recursion(tagname, text, 'listtag') + '[/list]' : '';
}

function litag(listoptions, text) {
	return '[*]' + text.replace(/(\s+)$/g, '');
}

function parsecode(text) {
	pcodecount++;

	text = text.replace(/^[\n\r]*([\s\S]+?)[\n\r]*$/ig, '$1');
	text = htmlspecialchars(text);

	codehtml[pcodecount] = '<br><div class="msgbody"><div class="msgheader">CODE:</div><div class="msgborder">' + text + '</div></div><br>';

	codecount++;
	return "[\tDISCUZ_CODE_" + pcodecount + "\t]";
}

function parsestyle(tagoptions, prepend, append) {
	var searchlist = [
		['align', true, 'text-align:\\s*(left|center|right);?', 1],
		['float', true, 'float:\\s*(left|right);?', 1],
		['color', true, '^(?:\\s|)color:\\s*([^;]+);?', 1],
		['font', true, 'font-family:\\s*([^;]+);?', 1],
		['size', true, 'font-size:\\s*(\\d+(\\.\\d+)?(px|pt|in|cm|mm|pc|em|ex|%|));?', 1],
		['b', false, 'font-weight:\\s*(bold);?'],
		['i', false, 'font-style:\\s*(italic);?'],
		['u', false, 'text-decoration:\\s*(underline);?']
	];
	var style = getoptionvalue('style', tagoptions);
	re = /^(?:\s|)color:\s*rgb\((\d+),\s*(\d+),\s*(\d+)\)(;?)/ig;
	style = style.replace(re, function($1, $2, $3, $4, $5) {return("color:#" + parseInt($2).toString(16) + parseInt($3).toString(16) + parseInt($4).toString(16) + $5);});
	var len = searchlist.length;
	for(var i = 0; i < len; i++) {
		re = new RegExp(searchlist[i][2], "ig");
		match = re.exec(style);
		if(match != null) {
			opnvalue = match[searchlist[i][3]];
			prepend += '[' + searchlist[i][0] + (searchlist[i][1] == true ? '=' + opnvalue + ']' : ']');
			append = '[/' + searchlist[i][0] + ']' + append;
		}
	}
	return {'prepend' : prepend, 'append' : append};
}

function parsetable(width, bgcolor, str) {

	if(isUndefined(width)) {
		var width = '';
	} else {
		width = width.substr(width.length - 1, width.length) == '%' ? (width.substr(0, width.length - 1) <= 98 ? width : '98%') : (width <= 560 ? width : '98%');
	}

	str = str.replace(/\[tr(?:=([\(\)%,#\w]+))?\]\s*\[td(?:=(\d{1,2}),(\d{1,2})(?:,(\d{1,4}%?))?)?\]/ig, function($1, $2, $3, $4, $5) {
		return '<tr' + ($2 ? ' style="background: ' + $2 + '"' : '') + '><td' + ($3 ? ' colspan="' + $3 + '"' : '') + ($4 ? ' rowspan="' + $4 + '"' : '') + ($5 ? ' width="' + $5 + '"' : '') + '>';
	});
	str = str.replace(/\[\/td\]\s*\[td(?:=(\d{1,2}),(\d{1,2})(?:,(\d{1,4}%?))?)?\]/ig, function($1, $2, $3, $4) {
		return '</td><td' + ($2 ? ' colspan="' + $2 + '"' : '') + ($3 ? ' rowspan="' + $3 + '"' : '') + ($4 ? ' width="' + $4 + '"' : '') + '>';
	});
	str = str.replace(/\[\/td\]\s*\[\/tr\]/ig, '</td></tr>');

	return '<table ' + (width == '' ? '' : 'width="' + width + '" ') + 'align="center" class="t_table"' + (isUndefined(bgcolor) ? '' : ' style="background: ' + bgcolor + '"') + '>' + str + '</table>';
}

function preg_replace(search, replace, str) {
	var len = search.length;
	for(var i = 0; i < len; i++) {
		re = new RegExp(search[i], "ig");
		str = str.replace(re, typeof replace == 'string' ? replace : (replace[i] ? replace[i] : replace[0]));
	}
	return str;
}

function recursion(tagname, text, dofunction, extraargs) {
	if(extraargs == null) {
		extraargs = '';
	}
	tagname = tagname.toLowerCase();

	var open_tag = '<' + tagname;
	var open_tag_len = open_tag.length;
	var close_tag = '</' + tagname + '>';
	var close_tag_len = close_tag.length;
	var beginsearchpos = 0;

	do {
		var textlower = text.toLowerCase();
		var tagbegin = textlower.indexOf(open_tag, beginsearchpos);
		if(tagbegin == -1) {
			break;
		}

		var strlen = text.length;

		var inquote = '';
		var found = false;
		var tagnameend = false;
		var optionend = 0;
		var t_char = '';

		for(optionend = tagbegin; optionend <= strlen; optionend++) {
			t_char = text.charAt(optionend);
			if((t_char == '"' || t_char == "'") && inquote == '') {
				inquote = t_char;
			} else if((t_char == '"' || t_char == "'") && inquote == t_char) {
				inquote = '';
			} else if(t_char == '>' && !inquote) {
				found = true;
				break;
			} else if((t_char == '=' || t_char == ' ') && !tagnameend) {
				tagnameend = optionend;
			}
		}

		if(!found) {
			break;
		}
		if(!tagnameend) {
			tagnameend = optionend;
		}

		var offset = optionend - (tagbegin + open_tag_len);
		var tagoptions = text.substr(tagbegin + open_tag_len, offset)
		var acttagname = textlower.substr(tagbegin * 1 + 1, tagnameend - tagbegin - 1);

		if(acttagname != tagname) {
			beginsearchpos = optionend;
			continue;
		}

		var tagend = textlower.indexOf(close_tag, optionend);
		if(tagend == -1) {
			break;
		}

		var nestedopenpos = textlower.indexOf(open_tag, optionend);
		while(nestedopenpos != -1 && tagend != -1) {
			if(nestedopenpos > tagend) {
				break;
			}
			tagend = textlower.indexOf(close_tag, tagend + close_tag_len);
			nestedopenpos = textlower.indexOf(open_tag, nestedopenpos + open_tag_len);
		}

		if(tagend == -1) {
			beginsearchpos = optionend;
			continue;
		}

		var localbegin = optionend + 1;
		var localtext = eval(dofunction)(tagoptions, text.substr(localbegin, tagend - localbegin), tagname, extraargs);

		text = text.substring(0, tagbegin) + localtext + text.substring(tagend + close_tag_len);

		beginsearchpos = tagbegin + localtext.length;

	} while(tagbegin != -1);

	return text;
}

function simpletag(options, text, tagname, parseto) {
	if(trim(text) == '') {
		return '';
	}
	text = recursion(tagname, text, 'simpletag', parseto);
	return '[' + parseto + ']' + text + '[/' + parseto + ']';
}

function strpos(haystack, needle, offset) {
	if(isUndefined(offset)) {
		offset = 0;
	}

	index = haystack.toLowerCase().indexOf(needle.toLowerCase(), offset);

	return index == -1 ? false : index;
}

function tabletag(attributes) {
	var width = '';
	re = /width=(["']?)(\d{1,4}%?)(\1)/i;
	var matches = re.exec(attributes);

	if(matches != null) {
		width = matches[2].substr(matches[2].length - 1, matches[2].length) == '%' ?
			(matches[2].substr(0, matches[2].length - 1) <= 98 ? matches[2] : '98%') :
			(matches[2] <= 560 ? matches[2] : '98%');
	} else {
		re = /width\s?:\s?(\d{1,4})([px|%])/ig;
		var matches = re.exec(attributes);
		if(matches != null) {
			width = matches[2] == '%' ? (matches[1] <= 98 ? matches[1] : '98%') : (matches[1] <= 560 ? matches[1] : '98%');
		}
	}

	var bgcolor = '';
	re = /(?:background|background-color|bgcolor)[:=]\s*(["']?)((rgb\(\d{1,3}%?,\s*\d{1,3}%?,\s*\d{1,3}%?\))|(#[0-9a-fA-F]{3,6})|([a-zA-Z]{1,20}))(\1)/i;
	var matches = re.exec(attributes);
	if(matches != null) {
		bgcolor = matches[2];
		width = width ? width : '98%';
	}

	return bgcolor ? '[table=' + width + ',' + bgcolor + ']' : (width ? '[table=' + width + ']' : '[table]');
}

function tdtag(attributes) {

	var colspan = 1;
	var rowspan = 1;
	var width = '';

	re = /colspan=(["']?)(\d{1,2})(\1)/ig;
	var matches = re.exec(attributes);
	if(matches != null) {
		colspan = matches[2];
	}

	re = /rowspan=(["']?)(\d{1,2})(\1)/ig;
	var matches = re.exec(attributes);
	if(matches != null) {
		rowspan = matches[2];
	}

	re = /width=(["']?)(\d{1,4}%?)(\1)/ig;
	var matches = re.exec(attributes);
	if(matches != null) {
		width = matches[2];
	}

	return in_array(width, ['', '0', '100%']) ?
		(colspan == 1 && rowspan == 1 ? '[td]' : '[td=' + colspan + ',' + rowspan + ']') :
		'[td=' + colspan + ',' + rowspan + ',' + width + ']';
}


function changeAction()
{
	var x=document.getElementById("myForm");
	x.action="threadplus.php?mod=pushtagsTopic&action=delsubmit";
	x.submit();
}

function delAppPushAction()
{
	var x=document.getElementById("appForm");
	x.action="threadplus.php?mod=pushmobileTopic&action=delsubmit";
	x.submit();
}

//modify:20120919 ajax添加到收藏夹
function ajaxmenu_fav(e, ctrlid, timeout, func, cache) {
	if(jsmenu['active'][0] && jsmenu['active'][0].ctrlkey == ctrlid) {
		doane(e);		
		return;
	} else if(is_ie && is_ie < 7 && document.readyState.toLowerCase() != 'complete') {
		
		return;
	}
	if(isUndefined(timeout)) timeout = 3000;
	if(isUndefined(func)) func = '';
	if(isUndefined(cache)) cache = 1; 
	

	var div = $(ctrlid + '_menu');
	if(cache && div) {
		showmMenu_fav(ctrlid, timeout);
		if(func) setTimeout(func + '(' + ctrlid + ')', timeout);
		doane(e);
	} else {
		if(!div) {
			div = document.createElement('div');
			div.id = ctrlid + '_menu';
			div.style.display = 'none';
			div.className = 'addfav';
			div.title = 'menu';
			document.body.appendChild(div);
		}
		
		var x = new Ajax();
		x.get($(ctrlid).href + '&inajax=1', function(s) {
			if(s.substr(0, 25) == '<div id="attackevasive_1"') {
				alert(String.fromCharCode(39057,32321,21047,26032,38480,21046) + '\n' + String.fromCharCode(24744,35775,38382,26412,31449,36895,24230,36807,24555,25110,32773,21047,26032,38388,38548,26102,38388,23567,20110,20004,31186,65281));
				return;
			}
			div.innerHTML = '<div class="closeaddfav" style="font-size:14px;" onclick="hidden_fav(\''+ctrlid+'\')">X</div><div class="cl"></div>';
			if (s.match('成功'))
			{
				div.innerHTML += '<div class="iconaddfav"><img src="images/fav/yes.jpg" width="43" height="43" alt="" />' + s + '</div>';
			}else{
				div.innerHTML += '<div class="iconaddfav"><img src="images/fav/fnd.jpg" width="43" height="43" alt="" />' + s + '</div>';
				if (s.match('登录'))
				{	
					div.innerHTML += '<div class="gofav"><a href="logging.php?action=login"><font color="red"><strong>登录</strong></font></a>或者<a href="register.php"><font color="red"><strong>注册用户</strong></font></a></div>'
				}
			}
			if (!s.match('登录'))
			{
				div.innerHTML += '<div class="gofav"><a href="my.php?item=favorites&type=forum" target="_blank"><img src="images/fav/hth.jpg" width="101" height="28" alt="" /></a></div>';
			}
			
			//div.innerHTML = '<div class="popupmenu_option">' + s + '</div>';
			showmMenu_fav(ctrlid, timeout);
			if(func) setTimeout(func + '(' + ctrlid + ')', timeout);
			if(!cache) setTimeout('document.body.removeChild(' + div.id + ')', timeout);
		});
		doane(e);
		//alert('ok');
	}
}

//modify:20120919添加到收藏夹 弹出框
function showmMenu_fav(id, timeout){
	timeout  = typeof(timeout)=='undefined' ? 3000 : timeout;
	showmenu = $(id+'_menu');
	if (!showmenu) return;
	showmenu.style.display = '';
	showmenu.style.left  = (document.body.clientWidth  - showmenu.offsetWidth)/2 + 'px';
	showmenu.style.top   = (document.documentElement.clientHeight - showmenu.offsetHeight)/2 + 'px';
//	setTimeout(function(){
//		showmenu.style.display = 'none';	
//	},timeout);
}

//modify:20120919 隐藏 弹出框
function hidden_fav(id){
	showmenu = $(id+'_menu');
	if (!showmenu) return;
	showmenu.style.display = 'none';
}