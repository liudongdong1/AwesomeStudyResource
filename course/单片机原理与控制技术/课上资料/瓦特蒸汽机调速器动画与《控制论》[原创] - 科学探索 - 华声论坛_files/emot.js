var Forum_Emot_class='http://bbs.voc.com.cn/images/smilies/,QQ变异表情,QQ经典表情,包子系列,不知名的一个专辑,常用语句系列,动作表情,搞笑幽默,精装版QQ表情,卡通人物,蜡笔小新系列,流氓兔系列,男女系列,其他动物,太阳系列,小破孩系列,游戏类,猪猪系列,祝福喜庆类,华声旧表情,兔斯基,悠嘻猴,洋葱头,华声论坛专用表情,圣诞表情';
var Forum_Emot_class_num=',197,89,90,19,82,62,19,297,25,18,14,18,70,8,29,11,43,17,28,31,161,49,40,5'; //每个类别的表情数

var Emot_PageSize =30; //心情一页个数
var Emot_PageSize2=15; //多少个换行 

Forum_Emot_class = Forum_Emot_class.split(",");
Forum_Emot_class_num = Forum_Emot_class_num.split(",");

var tmp_i =0;
var tmp_str = "<font color=blue><b>请选择表情分类：</b></font><select id=emotclass onchange=\"javascript:ShowForum_Emot(1);\">";
tmp_str+= "<option value=23 selected>华声论坛专用表情</option>";
tmp_str+= "<option value=24>圣诞表情</option>";
tmp_str+= "<option value=2>QQ经典表情</option>";
tmp_str+= "<option value=1>QQ变异表情</option>";
tmp_str+= "<option value=20>兔斯基</option>";
tmp_str+= "<option value=21>悠嘻猴</option>";
tmp_str+= "<option value=22>洋葱头</option>";
tmp_str+= "<option value=3>包子系列</option>";
tmp_str+= "<option value=4>不知名的一个专辑</option>";
tmp_str+= "<option value=5>常用语句系列</option>";
tmp_str+= "<option value=6>动作表情</option>";
tmp_str+= "<option value=7>搞笑幽默</option>";
tmp_str+= "<option value=8>精装版QQ表情</option>";
tmp_str+= "<option value=9>卡通人物</option>";
tmp_str+= "<option value=10>蜡笔小新系列</option>";
tmp_str+= "<option value=11>流氓兔系列</option>";
tmp_str+= "<option value=12>男女系列</option>";
tmp_str+= "<option value=13>其他动物</option>";
tmp_str+= "<option value=14>太阳系列</option>";
tmp_str+= "<option value=15>小破孩系列</option>";
tmp_str+= "<option value=16>游戏类</option>";
tmp_str+= "<option value=17>猪猪系列</option>";
tmp_str+= "<option value=18>祝福喜庆类</option>";
tmp_str+= "<option value=19>华声旧表情</option>";



tmp_str+="</select><span style=\"color:red;font-weight:bold;cursor:pointer\" onclick=\"javascript:ShowForum_Emot(1);\" id=\"viewface\">显示表情</span><br>";

document.write (tmp_str);

function ShowForum_Emot(thepage)
{
	var Emot_PageCount;
	var Emot_classid = document.getElementById("emotclass").value;
	
	if (Emot_classid==50) {
		get_my_face();
		return;
	}else{
		document.getElementById("emot_my").innerHTML = ""
	}
	
	document.getElementById("viewface").style.display = "none";
	
	var Emot_Count=Forum_Emot_class_num[Emot_classid]; //总数
	
	if(Emot_Count%Emot_PageSize==0)
	{
		Emot_PageCount=(Emot_Count)/Emot_PageSize
	}else{
		Emot_PageCount=Math.floor((Emot_Count)/Emot_PageSize)+1
	}
	thepage=parseInt(thepage);
	if (thepage<=Emot_PageCount){
		var istr
		var EmotStr='';
		var EmotPath=Forum_Emot_class[0]+Emot_classid+'/';
		for(i=(thepage-1)*Emot_PageSize;i<(thepage-1)*Emot_PageSize+Emot_PageSize;i++)
		{
			if (i==Emot_Count){break}
			istr='newem'+Emot_classid+'.'+(i+1)
			EmotStr+='<img id="smilie_'+(i+1)+'" title="<img src='+EmotPath+(i+1)+'.gif>" style="cursor: pointer;" onClick=insertBBCode("['+istr+']") src="'+EmotPath+(i+1)+'.gif" onload=\"javascript:if(this.width>40)this.width=40\">&nbsp;';
			if((i+1)%Emot_PageSize2==0) EmotStr+='<br>';
		}
		EmotStr+='分页：<b>'+thepage+'</b>/<b>'+Emot_PageCount+'</b>,共<b>'+(Emot_Count)+'</b>个,每页<b>'+(Emot_PageSize)+'</b>个';
		EmotStr+=" 转第<select id=emotpage onchange=\"ShowForum_Emot(this.value);\">";
		for (i=1; i<=Emot_PageCount;i++ )
		{
			EmotStr+="<option value=\""+i+"\">"+i+"</option>";
		}
		EmotStr+="<\/select>页";
		var Forum_EmotObj=document.getElementById("emot")
		Forum_EmotObj.innerHTML=EmotStr;
		document.getElementById('emotpage').options[thepage-1].selected=true;
	}
}
document.write ('<span id="emot"></span><span id="emot_my"></span>');

var xmlHttp
function get_my_face(){//得到我的false
	document.getElementById("emot").innerHTML= ""
	document.getElementById("emot_my").innerHTML = document.getElementById("emot_my_back").innerHTML
}