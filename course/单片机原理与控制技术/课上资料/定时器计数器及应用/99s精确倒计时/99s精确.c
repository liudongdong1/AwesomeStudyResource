#include<reg52.h>
#define uchar unsigned char
#define uint unsigned int
char i;
char ctime=99;
uchar code led[]={0xc0,0xf9,0xa4,0xb0,0x99,0x92,0x82,0xf8,0x80,0x90};
void main()
{
  TMOD=0X01; //�趨��ʱ��Ϊ������ʽ1
  TH0=(65536-45872)/256; //װ��ֵ��11.0592 MHZ����ʱ50MS,����ֵΪ45872
  TL0=(65536-45872)%256; 
  EA=1;   //�����ж�
  ET0=1;  //�򿪶�ʱ���ж�
  TR0=1;  //������ʱ��0
  while(1)
  {
   P0=led[ctime/10];
   P2=led[ctime%10];
 
  }

}
   void time() interrupt   //��ʱ��0�жϷ������
{
  TH0=(65536-45872)/256;   //��װ��ֵ
  TL0=(65536-45872)%256;   
  i++;
  if(i==20)                //���i=20��˵��1sʱ�䵽
  {
   i=0;
   ctime--;
   if(ctime<0)
   {
    ctime=99;
  }
 }  
}