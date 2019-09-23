VOC.util.Event.onDOMReady(function () {
	var D=VOC.util.Dom,E=VOC.util.Event,Anim=VOC.util.Anim,iframesrc="http://bbs.voc.com.cn/app/zhuwei/zhuwei.php?tid=" + tid;//zhuwei-error.html
	var mixin=function(target,options){
		for(var i in options){
			target[i]=options[i]
		}
	}
	var mixinStyle=function(ele,styles){
		if(ele.length){
			for(var i=0;i<ele.length;i++){
				mixin(ele[i].style,styles)
			}
			return;
		}
		mixin(ele.style,styles)
	}

	var popup=D.get("J_weiwang"),close=D.get("J_weiwang_close"),btn=D.get("btn-zhuwei"),layer=document.createElement("div");
	var pageWidth=D.getDocumentWidth();
	//创建一行表格需要的数据

	mixinStyle(layer,{
		width:pageWidth+"px",
		height:D.getDocumentHeight()+"px",
		position:"absolute",
		left:"0",
		top:"0",
		backgroundColor:"#333",
		zIndex:"10000",
		display:"none"
	});

	layer.id="layer";
	D.setStyle(layer,"opacity",0);
	D.setStyle(popup,"opacity",0);
	document.body.appendChild(layer);



	E.addListener(close,"click",function(){//关闭
		popup.style.display="none"
		layer.style.display="none"
		D.setStyle(layer,"opacity",0);
		D.setStyle(popup,"opacity",0);

	})

	D.get("zhuwei_iframe").hasSrc=false;
	E.addListener(btn,"click",function(){//打开

		if(discuzuid<=0) {check_uid();}
		if(discuzuid<=0) {return false;}
		if(D.get("zhuwei_iframe").hasSrc==false){
			D.get("zhuwei_iframe").src=iframesrc;
			D.get("zhuwei_iframe").hasSrc=true;
		}
		D.setStyle(layer,"display","block");
		var anim=new Anim(layer,{opacity:{from:0,to:0.5}},0.4);
		anim.animate();
		D.setStyle(popup,"display","block");
		var anim=new Anim(popup,{opacity:{from:0,to:1}},0.4);
		anim.animate();
		mixinStyle(popup,{
			left:(pageWidth-600)/2+"px",
			top:D.getDocumentScrollTop()+200+"px"
		});
	});
	/*        window.success=function(param){
	D.get("zhuwei_iframe").hasSrc=false;
	if(D.get("zhuwei").style.display=="none") D.get("zhuwei").style.display="block"
	data=param;
	var table1=D.get("J_zhuwei_table");
	var trs=table1.getElementsByTagName("tr");
	if(trs.length==0){
	var tr1=table1.insertRow(0)
	tr1.insertCell(0).className="username";
	tr1.insertCell(1).className="time";
	tr1.insertCell(2).className="coin";
	tr1.insertCell(3).className="content";

	}else{
	var tr1=trs[0].cloneNode(true);
	trs[0].parentNode.insertBefore(tr1,trs[0]);
	}
	tr1.cells[0].innerHTML="<a class='name name-link' target='_blank' href='http:\/\/bangpai.taobao.com\/user\/groups\/"+data.userID+".htm'>"+data.username+"</a>";
	tr1.cells[1].innerHTML=getTime();
	tr1.cells[2].innerHTML=createStar(data.coin);
	tr1.cells[3].innerHTML=data.content;
	D.get("zhuwei-all-count").innerHTML=D.get("zhuwei-all-count").innerHTML*1+data.coin*1;
	popup.style.display="none"
	layer.style.display="none"
	D.setStyle(layer,"opacity",0);
	D.setStyle(popup,"opacity",0);

	updateWeiwangTable();
	}
	window.failed=function(){
	D.get("zhuwei_iframe").hasSrc=false;
	popup.style.display="none"
	layer.style.display="none"
	D.setStyle(layer,"opacity",0);
	D.setStyle(popup,"opacity",0);
	}*/

}
);
function AddFavorite(sURL, sTitle)
{
	try
	{
		window.external.addFavorite(window.location.href , sTitle);
	}
	catch (e)
	{
		try
		{
			window.sidebar.addPanel(sTitle, window.location.href , "");
		}
		catch (e)
		{
			try{
				if ( window.sidebar && 'object' == typeof( window.sidebar ) && 'function' == typeof( window.sidebar.addPanel ) ){
					window.sidebar.addPanel(sTitle, window.location.href , '');
				}else if ( document.all && 'object' == typeof( window.external ) ){
					window.external.addFavorite(window.location.href , sTitle);
				}
			}catch(e){
				alert('您使用的浏览器不支持此功能，请按“Ctrl + D”键手工加入收藏');
			}
			return false;
		}
	}
}