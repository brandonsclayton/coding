

import serial
import time

ser = serial.Serial('/dev/ttyACM0',9600)

ihum  = 0       # Index where humidity is
itemp = 1       # Index where temp is

while(True):
    #start_time = time.time()
    strg = ser.readline()
    print strg
