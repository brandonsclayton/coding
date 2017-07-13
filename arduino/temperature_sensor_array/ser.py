#!/bin/python

import serial
import time

ser = serial.Serial('/dev/ttyACM0',9600)

ns = 2  # Number of sensors

while(True):
  msg = ser.readline().strip()
  msg_ck = msg.split(':')
  if msg_ck[0] == 'MSG':
    msg = msg_ck[1:]   
    nmsg = len(msg)
    sensor_id = [];
    temp      = [];
    for js in range(0,nmsg,ns):
      sensor_id.append(msg[js])
      temp.append(msg[js+1])
    
    print temp
    print sensor_id
