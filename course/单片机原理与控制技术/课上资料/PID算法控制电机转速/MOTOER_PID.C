#include<reg52.h>
#include"lcd1602.h"

sfr T2MOD = 0x0c9;
#define uchar unsigned char
#define uint unsigned int

sbit Q0 = P2^4;
sbit Q1 = P2^5;
sbit Q2 = P2^6;
sbit Q3 = P2^7;

sbit PWM	 	= P1^7;
sbit UP		 	= P1^0;
sbit DOWM	 	= P1^1;
sbit GORB		= P2^3; //换相
sbit ADDSPEED 	= P1^2;
sbit SUBSPEED	= P1^3;

uint tuint = 65535;
uint tpwm = 1;	//pwm周期为10000us tpwm变量表示pwm高电平时间，也相当于占空比 (仿真时，频率高时，电机反应慢。在实物上要加大频率)
uchar t1_flag = 0;

uint pulse = 0;
uint t0_flag = 0;
uchar t2_flag = 0;
bit t2_over = 0;
bit Just_Get = 1;


#define 	ZZ 		{ Q0 = 0;Q1 = 0;Q2 = 1;Q3 = 1;}	//正转
#define 	FZ 		{ Q0 = 1;Q1 = 1;Q2 = 0;Q3 = 0;}	//反转
#define 	STOP	{ Q0 = 1;Q1 = 0;Q2 = 1;Q3 = 0;}	//停止
//禁止出现 Q0 = 0;Q1 = 1;Q2 = 0;Q3 = 1; 不然会烧掉mos管

//************************ PID *************************************
float now = 0,bef = 0,bbef = 0; 	//本次采样值，上次采样值，上上次采样值
float err_now,err_bef,err_bbef;		//当前偏差，上次偏差，上上次偏差
float error_add = 0;				//所有偏差之和
float set = 25;						//设定值

float kp = 25;
float ki = 25;
float kd = 0;

//*****************************************************************

void delayms(uint ms)//延时？个 ms
{
    uchar a,b,c;
	while(ms--)
	{ 
	  for(c=1;c>0;c--)
        for(b=142;b>0;b--)
            for(a=2;a>0;a--);
	}
}

void timer_init()
{
	EA = 1;
	ET0 = 1;
	ET1 = 1;
	ET2 = 1;
	
	TMOD = 0x15; //定时器0 计数模式 定时器1模式1
	T2MOD = 0x01;
	
	TH0 = TL0 = 255;
	TH2 = 0x3C;
	TL2 = 0xB0;		//50MS
	
}
void timer1() interrupt 3
{
	if(t1_flag == 0)
	{
		t1_flag = 1;
		PWM = 1;
		TH1 = (tuint - tpwm + 1)/256;
		TL1 = (tuint - tpwm + 1)%256;
		
	}
	else
	{
		t1_flag = 0;
		PWM = 0;
		TH1 = (tuint - 10000 + tpwm + 1)/256;
		TL1 = (tuint - 10000 + tpwm + 1)%256;
	}
}

void timer0() interrupt 1
{
	TH0 = TL0 = 255;
	t0_flag++;
}
void timer2() interrupt 5
{
	TF2 = 0;
	TH2 = 0x3C;
	TL2 = 0xB0;		//50MS
	
	t2_flag++;
	
	if(t2_flag == 2)
	{
		TR0 = 0;
		TR2 = 0;
		t2_flag = 0;
		t2_over = 1;	//表示100ms时间到
	}
}
void GetPulse()
{
	t0_flag = 0;
	t2_flag = 0;
	
	TH0 = TL0 = 255;
	TH2 = 0x3C;
	TL2 = 0xB0;		//50MS
	
	TR0 = 1;
	TR2 = 1;
}

int PID()	//增量式PID
{
	int change;

	err_now = set - now;
	err_bef = set - bef;
	err_bbef = set - bbef;
	
	change = kp*(err_now - err_bef) + ki*err_now + kd*(err_now - 2*err_bef + err_bbef);
	
/*	
	if(set >= now)
	{	
		if(set - now > 1)
			change = kp*(err_now - err_bef) + ki*err_now + kd*(err_now - 2*err_bef + err_bbef);
		else
			change = 0.2*kp*(err_now - err_bef) + 0.5*ki*err_now + kd*(err_now - 2*err_bef + err_bbef);
	}
	else if(now > set)
	{
		if(now - set > 1)
			change = kp*(err_now - err_bef) + ki*err_now + kd*(err_now - 2*err_bef + err_bbef);
		else
			change = 0.2*kp*(err_now - err_bef) + 0.5*ki*err_now + kd*(err_now - 2*err_bef + err_bbef);
			
	}
*/
	
	//change = (kp + ki + kd)*(set - now) + (-kp - 2*kd)*(set - bef) + kd*(set - bbef);
	//change = kp*(set - now) + ki*(set - bef) + kd*(set - bbef);
	if(change > 0)
	{
		printchar(1,10,'+');	
		printuint(1,11,4,change);
		
	}
	else if(change < 0)
	{	
		printchar(1,10,'-');
		printuint(1,11,4,-change);
	}
	else if(change == 0)
	{	
		printchar(1,10,' ');
		printword(1,11," 0  ");

	}
	
	return(change);
}

int PID2()		//位置式PID
{
	
	int num = 0;
	static num_bef = 0;
	
	err_now = set - now;
	err_bef = set - bef;
	
	error_add = error_add + err_now;  //误差累加。一旦误差为0则error_add的值不变，PID输出值不变

	num = kp*err_now + ki*error_add + kd*(err_now - err_bef);
	
/*	
	if(set - now >= 0)
	{	
		if(set - now > 1)
			num = kp*err_now + ki*error_add + kd*(err_now - err_bef);
		else
			num = 0.1*kp*err_now + ki*error_add + kd*(err_now - err_bef);
	}
	else
	{
		if(now - set > 1)
			num = kp*err_now + ki*error_add + kd*(err_now - err_bef);
		else
			num = 0.1*kp*err_now + ki*error_add + kd*(err_now - err_bef);
			
	}
	*/
	
	if(num > num_bef)
	{
		printchar(1,10,'+');	
		printuint(1,11,4,num - num_bef);
	}
	else if(num < num_bef)
	{
		printchar(1,10,'-');	
		printuint(1,11,4,num_bef - num);
	}
	else
	{	
		printchar(1,10,' ');
		printuint(1,11,4,0);
	}
	
	num_bef = num;
	
	return((uint)num);
}

void main()
{	
	
	lcd_init();
	timer_init();
	TH1 = TL1 = 255;
	
	printword(0,0,"P:");		//比例系数
	printword(0,5,"S:");		//设定值 
	printword(1,0,"TPWM:");		//当前占空比
	printword(0,10,"PS:");		//当前电机反馈的每秒脉冲数
	
	while(1)
	{
		if(GORB == 1)
		{	ZZ;		}
		else
		{	FZ;		}
		
		if(ADDSPEED == 0)
			set++;
		if(SUBSPEED == 0)
			set--;
		
		if(Just_Get == 1)
		{	
			Just_Get = 0;
			GetPulse();
		}
		else if(t2_over == 1)
		{	
			t2_over = 0;
			Just_Get = 1;
			pulse = t0_flag;
			bbef = bef;
			bef = now;
			now = t0_flag;
			
			if(set != 0)
			{
				TR1 = 1;
			}
			else
			{
				TR1 = 0;
				PWM = 0;
			}
			
		//	tpwm = tpwm + PID();		//增量式PID
			tpwm = PID2();				//位置式PID
					
		}
		
		if(UP == 0)
			kp = kp + 1;
		if(DOWM == 0)
			kp = kp - 1;
		
		printuint(0,2,3,kp);
		printuint(0,7,3,set);
		printuint(1,5,4,tpwm);
		printuint(0,13,5,pulse);

	}
	
}
	