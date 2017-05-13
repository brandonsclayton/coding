

import serial
import time

ser = serial.Serial('/dev/ttyACM2',9600)

ihum  = 0       # Index where humidity is
itemp = 1       # Index where temp is

while(True):
    #start_time = time.time()
    strg = ser.readline().split()
    hum = float(strg[ihum])
    temp = float(strg[itemp])
    #end_time = time.time()
    print "Humidity: %g \t Temperature: %g  \n"%(hum,temp)
    #print "Time: %g \n" %(end_time-start_time)
