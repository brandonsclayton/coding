

import serial
import time

ser = serial.Serial('/dev/ttyACM3',9600)


while(True):
    #start_time = time.time()
    strg = ser.readline()
    print strg
