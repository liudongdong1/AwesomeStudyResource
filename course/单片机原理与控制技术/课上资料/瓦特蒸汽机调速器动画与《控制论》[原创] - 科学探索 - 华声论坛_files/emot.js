var Forum_Emot_class='http://bbs.voc.com.cn/images/smilies/,QQ�������,QQ�������,����ϵ��,��֪����һ��ר��,�������ϵ��,��������,��Ц��Ĭ,��װ��QQ����,��ͨ����,����С��ϵ��,��å��ϵ��,��Ůϵ��,��������,̫��ϵ��,С�ƺ�ϵ��,��Ϸ��,����ϵ��,ף��ϲ����,�����ɱ���,��˹��,������,���ͷ,������̳ר�ñ���,ʥ������';
var Forum_Emot_class_num=',197,89,90,19,82,62,19,297,25,18,14,18,70,8,29,11,43,17,28,31,161,49,40,5'; //ÿ�����ı�����

var Emot_PageSize =30; //����һҳ����
var Emot_PageSize2=15; //���ٸ����� 

Forum_Emot_class = Forum_Emot_class.split(",");
Forum_Emot_class_num = Forum_Emot_class_num.split(",");

var tmp_i =0;
var tmp_str = "<font color=blue><b>��ѡ�������ࣺ</b></font><select id=emotclass onchange=\"javascript:ShowForum_Emot(1);\">";
tmp_str+= "<option value=23 selected>������̳ר�ñ���</option>";
tmp_str+= "<option value=24>ʥ������</option>";
tmp_str+= "<option value=2>QQ�������</option>";
tmp_str+= "<option value=1>QQ�������</option>";
tmp_str+= "<option value=20>��˹��</option>";
tmp_str+= "<option value=21>������</option>";
tmp_str+= "<option value=22>���ͷ</option>";
tmp_str+= "<option value=3>����ϵ��</option>";
tmp_str+= "<option value=4>��֪����һ��ר��</option>";
tmp_str+= "<option value=5>�������ϵ��</option>";
tmp_str+= "<option value=6>��������</option>";
tmp_str+= "<option value=7>��Ц��Ĭ</option>";
tmp_str+= "<option value=8>��װ��QQ����</option>";
tmp_str+= "<option value=9>��ͨ����</option>";
tmp_str+= "<option value=10>����С��ϵ��</option>";
tmp_str+= "<option value=11>��å��ϵ��</option>";
tmp_str+= "<option value=12>��Ůϵ��</option>";
tmp_str+= "<option value=13>��������</option>";
tmp_str+= "<option value=14>̫��ϵ��</option>";
tmp_str+= "<option value=15>С�ƺ�ϵ��</option>";
tmp_str+= "<option value=16>��Ϸ��</option>";
tmp_str+= "<option value=17>����ϵ��</option>";
tmp_str+= "<option value=18>ף��ϲ����</option>";
tmp_str+= "<option value=19>�����ɱ���</option>";



tmp_str+="</select><span style=\"color:red;font-weight:bold;cursor:pointer\" onclick=\"javascript:ShowForum_Emot(1);\" id=\"viewface\">��ʾ����</span><br>";

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
	
	var Emot_Count=Forum_Emot_class_num[Emot_classid]; //����
	
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
		EmotStr+='��ҳ��<b>'+thepage+'</b>/<b>'+Emot_PageCount+'</b>,��<b>'+(Emot_Count)+'</b>��,ÿҳ<b>'+(Emot_PageSize)+'</b>��';
		EmotStr+=" ת��<select id=emotpage onchange=\"ShowForum_Emot(this.value);\">";
		for (i=1; i<=Emot_PageCount;i++ )
		{
			EmotStr+="<option value=\""+i+"\">"+i+"</option>";
		}
		EmotStr+="<\/select>ҳ";
		var Forum_EmotObj=document.getElementById("emot")
		Forum_EmotObj.innerHTML=EmotStr;
		document.getElementById('emotpage').options[thepage-1].selected=true;
	}
}
document.write ('<span id="emot"></span><span id="emot_my"></span>');

var xmlHttp
function get_my_face(){//�õ��ҵ�false
	document.getElementById("emot").innerHTML= ""
	document.getElementById("emot_my").innerHTML = document.getElementById("emot_my_back").innerHTML
}