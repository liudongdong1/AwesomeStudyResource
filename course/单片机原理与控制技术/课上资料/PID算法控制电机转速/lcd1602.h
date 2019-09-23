#include <intrins.h>
#define uchar unsigned char
#define uint unsigned int

//************************************ lcd1602��ʼ ***********************************

#define LCD_DATA P0		//P0�ڽ�LCD���ݿ�
sbit RS 		= P2^2;
sbit RW 		= P2^1;
sbit LCDEN 		= P2^0;
sbit LCD_BUSY	= P0^7;


//********* lcd1602��ʱ���� ***************
void delayms_lcd(uint ms)//��ʱ���� ms
{
    uchar a,b,c;
	while(ms--)
	{ 
	  for(c=1;c>0;c--)
        for(b=142;b>0;b--)
            for(a=2;a>0;a--);
	}
}
//**********�ַ������ƺ���**********
void string_copy(uchar *target,uchar *source)//�ַ������� target:Ŀ�� source��Դ
{
	uchar i = 0;

	for(i = 0;source[i] != '\0';i++)//ע��target�ĳ��� �ޱ�����ʩ��
	{
		target[i] = source[i];	
	}
	target[i] = '\0';
}
//**********�ַ����ȽϺ���**********
uchar string_cmp(uchar *target,uchar *source)//�ַ����Ƚ� target:Ŀ�� source��Դ
{
	uchar revalue;
	uchar i = 0;

	for(i = 0;target[i] != '\0' && source[i] != '\0';i++)  //������������'\0'��ִ�� ����һ������'\0'������
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
//**************** LCD1602���� ********************
//LCD����������
void busy_check()  //æµ���
{	
/*	RW = 1;	 //��
	RS = 0;	//ָ��Ĵ���
	LCD_DATA = 0xFF;//ʵ��֤������ʱҪ��I/O��Ҫ��1  

	LCDEN = 0;
	_nop_();
	_nop_();
	_nop_();
	_nop_();
	LCDEN = 1;// EN�ߵ�ƽ����Ϣ ������ִ��ָ��
	_nop_();
	_nop_();
	_nop_();
	_nop_();
	while(1)
	{
		if(LCD_BUSY == 0)//P07 == 0����ѭ��
			break; 
	}  */
	delayms_lcd(2);//����ʱ����ʱ�� ���ص���ʵ��Ƭ����ʱ�������ע�͵��������������䡣
}
void lcdwrcom(uchar command)//дָ�� 
{	
	busy_check();
	RW = 0;//д
    RS = 0;//ָ��Ĵ���
    LCD_DATA = command;

	LCDEN = 1;//������д��ָ��
	_nop_();
	_nop_();
	_nop_();
	_nop_();
	LCDEN = 0;
}
void lcdwrdata(uchar lcd_data)//д����	���֡���ĸ�������Ŷ�������
{
	busy_check();
	RW = 0;//д
    RS = 1;//���ݼĴ���
    LCD_DATA = lcd_data; 

	LCDEN = 1;//������д��ָ��
	_nop_();
	_nop_();
	_nop_();
	_nop_();
	LCDEN = 0;	
}

void lcd_init()
{	
	delayms_lcd(15);//��Ҫ lcd1602�ϵ絽��ѹ�ȶ���Ҫʱ��   
	RW = 0;//д
	RS = 0;//ָ��Ĵ���
    LCD_DATA = 0x38;// 0x38������ʾģʽΪ��16X2 ��ʾ,5X7 ����,8 λ���ݽӿ�' 
	LCDEN = 1;
	_nop_();
	_nop_();
	_nop_();
	_nop_();
	LCDEN = 0;
	delayms_lcd(5);

	lcdwrcom(0x0c);//����ʾ �޹�� ����˸
	lcdwrcom(0x06);//ָ��3 ������� ��Ļ���������ƶ���Ч
	lcdwrcom(0x01);// ����ʾ����긴λ����ַ00Hλ�á�
}

//LCD��չ������
void address(uchar x,uchar y)  //��λ��һ��Ҫд���ĵ�ַ
{	
	uchar location;
	if(x == 0)
	    location = 0x80|y;
	else
		location = 0xC0|y; 

	 lcdwrcom(location);		
}
void printchar(uchar x,uchar y,uchar letter)//��ʾ��ĸ�������ַ�
{
	address(x,y);
	lcdwrdata(letter);
}

void printword(uchar x,uchar y,uchar *word) //��ʾ���ʣ��ַ����飩
{
	uchar i = 0;
	for(i = 0;word[i] != '\0';i++)
	{
		address(x,y + i);
		lcdwrdata(word[i]);	
	}	
}
void printuint(uchar x,uchar y,uchar num_ws_max,uint num)//��ʾ�޷������� 0~65535 x:�� y���� num_ws_max ���������λ��
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
	//	str[5] = '\0';	 //�ֶ����ַ���������־
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
	 
	for(i = 0;i <= 5;i++)	//uint���� ���ֵ65535 Ϊ5λ��
	{
		if(str[i] != '\0' && i < num_ws_max)
		{
			address(x,y + i);
			lcdwrdata(str[i]);
		}
		else if(str[i] == '\0' && i < num_ws_max)
		{
			address(x,y+i);
			lcdwrdata(' ');//�ո�	  					// ʵ�ֹ��ܣ��ڴ˱�����λ����Χ�ڣ���û���ֵ�λ��0x20���ո�
								 						//���磺�����3λ��999 ����Ϊ99ʱ����Ϊ9+'0' 9+'0' 0x20
		}					
	}	
}
//******************* lcd1602��β *****************************
