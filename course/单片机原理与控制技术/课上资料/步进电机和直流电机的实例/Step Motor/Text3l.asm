ORG		00H
START:	MOV		DPTR,#TAB1
		MOV		R0,#03
		MOV		R4,#0
		MOV		P1,#3

WAIT:	MOV		P1,R0			;��ʼ�Ƕ�,0��
		MOV		P0,#0FFH
		JNB		P0.0,POS	 	;�жϼ���״̬
		JNB		P0.1,NEG
		SJMP	WAIT

JUST:	JB		P0.1,NEG		;�״ΰ�������
POS:	MOV		A,R4			;��ת9��
		MOVC	A,@A+DPTR
		MOV		P1,A
		ACALL	DELAY
		INC		R4
		AJMP	KEY
NEG:	MOV		R4,#6			;��ת9��
		MOV		A,R4
		MOVC	A,@A+DPTR
		MOV		P1,A
		ACALL	DELAY
		AJMP	KEY

					
KEY:	MOV		P0,#03H			;���������
		MOV		A,P1				
		JB		P0.0,FZ1
		CJNE	R4,#8,LOOPZ		;�ǽ�����־
		MOV		R4,#0
LOOPZ:	MOV		A,R4
		MOVC	A,@A+DPTR
		MOV		P1,A			;�����������
		ACALL	DELAY			;������ʱ
		INC		R4				;��ַ��1
	 	AJMP	KEY
FZ1:	JB		P0.1,KEY
	 	CJNE	R4,#255,LOOPF	;�ǽ�����־
		MOV		R4,#7
LOOPF:	DEC		R4
		MOV		A,R4
		MOVC	A,@A+DPTR
		MOV		P1,A			;�����������
		ACALL	DELAY			;������ʱ
		AJMP	KEY

DELAY:	MOV		R6,#5
DD1:	MOV		R5,#080H
DD2:	MOV		R7,#0
DD3:	DJNZ	R7,DD3
		DJNZ	R5,DD2
		DJNZ	R6,DD1
		RET
TAB1:	DB		02H,06H,04H,0CH
		DB		08H,09H,01H,03H	;��תģ������
		END