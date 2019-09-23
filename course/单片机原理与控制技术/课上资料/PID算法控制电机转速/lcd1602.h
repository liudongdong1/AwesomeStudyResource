#include <intrins.h>
#define uchar unsigned char
#define uint unsigned int

//************************************ lcd1602开始 ***********************************

#define LCD_DATA P0		//P0口接LCD数据口
sbit RS 		= P2^2;
sbit RW 		= P2^1;
sbit LCDEN 		= P2^0;
sbit LCD_BUSY	= P0^7;


//********* lcd1602延时函数 ***************
void delayms_lcd(uint ms)//延时？个 ms
{
    uchar a,b,c;
	while(ms--)
	{ 
	  for(c=1;c>0;c--)
        for(b=142;b>0;b--)
            for(a=2;a>0;a--);
	}
}
//**********字符串复制函数**********
void string_copy(uchar *target,uchar *source)//字符串复制 target:目标 source：源
{
	uchar i = 0;

	for(i = 0;source[i] != '\0';i++)//注意target的长度 无保护措施！
	{
		target[i] = source[i];	
	}
	target[i] = '\0';
}
//**********字符串比较函数**********
uchar string_cmp(uchar *target,uchar *source)//字符串比较 target:目标 source：源
{
	uchar revalue;
	uchar i = 0;

	for(i = 0;target[i] != '\0' && source[i] != '\0';i++)  //两个都不等于'\0'才执行 出现一个等于'\0'就跳出
	{
		if(target[i] == source[i])
		{	
			revalue = 1;
		}
		else
		{
			revalue = 0;
			break;
		}		
	}
	if(revalue == 1)
	{
		if(target[i] == '\0' && source[i] == '\0')
			revalue = 1;
		else
			revalue = 0;	
	}
	return(revalue);
}
//**************** LCD1602函数 ********************
//LCD基本函数：
void busy_check()  //忙碌检测
{	
/*	RW = 1;	 //读
	RS = 0;	//指令寄存器
	LCD_DATA = 0xFF;//实验证明读数时要将I/O口要置1  

	LCDEN = 0;
	_nop_();
	_nop_();
	_nop_();
	_nop_();
	LCDEN = 1;// EN高电平读信息 负跳变执行指令
	_nop_();
	_nop_();
	_nop_();
	_nop_();
	while(1)
	{
		if(LCD_BUSY == 0)//P07 == 0跳出循环
			break; 
	}  */
	delayms_lcd(2);//仿真时用延时法 下载到真实单片机上时，将这句注释掉，采用上面的语句。
}
void lcdwrcom(uchar command)//写指令 
{	
	busy_check();
	RW = 0;//写
    RS = 0;//指令寄存器
    LCD_DATA = command;

	LCDEN = 1;//负跳变写入指令
	_nop_();
	_nop_();
	_nop_();
	_nop_();
	LCDEN = 0;
}
void lcdwrdata(uchar lcd_data)//写数据	数字、字母、标点符号都是数据
{
	busy_check();
	RW = 0;//写
    RS = 1;//数据寄存器
    LCD_DATA = lcd_data; 

	LCDEN = 1;//负跳变写入指令
	_nop_();
	_nop_();
	_nop_();
	_nop_();
	LCDEN = 0;	
}

void lcd_init()
{	
	delayms_lcd(15);//必要 lcd1602上电到电压稳定需要时间   
	RW = 0;//写
	RS = 0;//指令寄存器
    LCD_DATA = 0x38;// 0x38设置显示模式为：16X2 显示,5X7 点阵,8 位数据接口' 
	LCDEN = 1;
	_nop_();
	_nop_();
	_nop_();
	_nop_();
	LCDEN = 0;
	delayms_lcd(5);

	lcdwrcom(0x0c);//打开显示 无光标 不闪烁
	lcdwrcom(0x06);//指令3 光标右移 屏幕所有文字移动无效
	lcdwrcom(0x01);// 清显示，光标复位到地址00H位置。
}

//LCD扩展函数：
void address(uchar x,uchar y)  //定位下一步要写数的地址
{	
	uchar location;
	if(x == 0)
	    location = 0x80|y;
	else
		location = 0xC0|y; 

	 lcdwrcom(location);		
}
void printchar(uchar x,uchar y,uchar letter)//显示字母、单个字符
{
	address(x,y);
	lcdwrdata(letter);
}

void printword(uchar x,uchar y,uchar *word) //显示单词（字符数组）
{
	uchar i = 0;
	for(i = 0;word[i] != '\0';i++)
	{
		address(x,y + i);
		lcdwrdata(word[i]);	
	}	
}
void printuint(uchar x,uchar y,uchar num_ws_max,uint num)//显示无符号整形 0~65535 x:行 y：列 num_ws_max 变量的最大位数
{
	uchar i = 0; 
	uchar str[5] = {0x20,0x20,0x20,0x20,0x20};

	if(num >= 10000)
	{
		str[0] = num/10000 + '0';
		str[1] = num%10000/1000 + '0';
		str[2] = num%1000/100 + '0';
		str[3] = num%100/10 + '0';
		str[4] = num%10 + '0'; 
	//	str[5] = '\0';	 //手动加字符串结束标志
	}
	else if(num >= 1000)
	{
		str[0] = num/1000 + '0';
		str[1] = num%1000/100 + '0';
		str[2] = num%100/10 + '0';
		str[3] = num%10 + '0';
		str[4] ='\0';
	}
	else if(num >= 100)
	{	
		str[0] = num/100 + '0';
		str[1] = num%100/10 + '0';
		str[2] = num%10 + '0';
		str[3] = '\0';
	}
	else if(num >=10)
	{	
		str[0] = num/10 + '0';
		str[1] = num%10 + '0';
		str[2] = '\0';
	}
	else if(num >= 0)
	{
		str[0] = num + '0';
		str[1] = '\0';
	}
	 
	for(i = 0;i <= 5;i++)	//uint类型 最大值65535 为5位数
	{
		if(str[i] != '\0' && i < num_ws_max)
		{
			address(x,y + i);
			lcdwrdata(str[i]);
		}
		else if(str[i] == '\0' && i < num_ws_max)
		{
			address(x,y+i);
			lcdwrdata(' ');//空格	  					// 实现功能：在此变量的位数范围内，把没数字的位存0x20（空格）
								 						//例如：最大有3位：999 当变为99时，存为9+'0' 9+'0' 0x20
		}					
	}	
}
//******************* lcd1602结尾 *****************************
