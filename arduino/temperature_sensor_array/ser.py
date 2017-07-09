

import serial
import time

ser = serial.Serial('/dev/ttyACM5',9600)


while(True):
  msg = ser.readline()
  msg_ck = msg.split(':')
  if msg.split[0] == 'MSG':
    msg = msg_ck[1]
    print msg

