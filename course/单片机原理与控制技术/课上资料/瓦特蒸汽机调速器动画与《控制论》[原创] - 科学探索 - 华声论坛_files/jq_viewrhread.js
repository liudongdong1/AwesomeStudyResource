jq(document).ready(function(){
	//get_louzhu_uc_games( uc_game_louzhu_uid );
	 /*微站二维码start*/
	set_QRCode();
	jq(window).scroll(function() {
		set_QRCode();
	});
	if(navigator.userAgent.indexOf("MSIE")>0) { 
		if(navigator.userAgent.indexOf("MSIE 6.0")>0 || navigator.userAgent.indexOf("MSIE 7.0")>0 || navigator.userAgent.indexOf("MSIE 8.0")>0) { 
			var render_type = 'canvas';
		} 
	} else { 
			var render_type = 'canvas';
	} 
	jQuery('#QRCode').qrcode({render:render_type,width:100,height:100,correctLevel:0,text:"http://www.cnwyy.me/mobile.php?act=module&name=base&do=bbs2wx&weid=175&id="+tid});
	jq('#QRCode').append("<p>微信扫一扫</p><p>转发到华声微站</p>");
	/*微站二维码end*/

	jq(".b-recomm-footer").hide();//隐藏乐知文字
	
});

//获取楼主最近在home玩的游戏
function get_louzhu_uc_games( uid ){
	jq.getJSON("http://home.voc.com.cn/app/bbsgames.php?uid="+uid+"&num=4&jsoncallback=?", function(data){
		var game_str = '';
			jq.each(data, function(i,item){
				game_str = game_str + "<li>" +
						"<a href=\"http://home.voc.com.cn/userapp.php?id="+item.appid+"\" target=\"_blank\"><img src=\"http://appicon.manyou.com/logos/"+item.appid+"\" height=\"50\" width=\"50\"/></a><br/>"+
						"<p><a href=\"http://home.voc.com.cn/userapp.php?id="+item.appid+"\" target=\"_blank\">"+item.appname+"</a></p></li>";
			});
			if( game_str.length>0 ){
				game_data = "<div class=\"game_title\">TA最近在玩...</div><ul>"+game_str+"</ul>";
				jq("#louzhu_game").html(game_data);
			}
		
	});
}

//设置二维码的漂浮状态
function set_QRCode(top,scrolls){ 
	var left_px = jq("#content_info").position().left + 10;
	var top = jq("#QRCode").parent().parent().offset().top+jq("#QRCode").parent().parent().height();
	var scrolls = jq(window).scrollTop()+ jq(window).height();
	if (scrolls > top) {
		// alert('进入可视区域');
		jq("#QRCode").css({"left":"10px","position":"absolute","display":""});
	}else {
		// alert('离开可视区域');
		jq("#QRCode").css({"left":left_px,"position":"fixed","display":""});
	}
}