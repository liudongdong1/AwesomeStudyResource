#include<reg52.h>
#define uchar unsigned char
#define uint unsigned int
char i;
char ctime=99;
uchar code led[]={0xc0,0xf9,0xa4,0xb0,0x99,0x92,0x82,0xf8,0x80,0x90};
void main()
{
  TMOD=0X01; //设定定时器为工作方式1
  TH0=(65536-45872)/256; //装初值，11.0592 MHZ晶振定时50MS,计数值为45872
  TL0=(65536-45872)%256; 
  EA=1;   //打开总中断
  ET0=1;  //打开定时器中断
  TR0=1;  //启动定时器0
  while(1)
  {
   P0=led[ctime/10];
   P2=led[ctime%10];
 
  }

}
   void time() interrupt   //定时器0中断服务程序
{
  TH0=(65536-45872)/256;   //重装初值
  TL0=(65536-45872)%256;   
  i++;
  if(i==20)                //如果i=20，说明1s时间到
  {
   i=0;
   ctime--;
   if(ctime<0)
   {
    ctime=99;
  }
 }  
}