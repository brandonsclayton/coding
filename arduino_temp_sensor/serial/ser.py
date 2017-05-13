

import serial
import timeit

ser = serial.Serial('/dev/ttyACM1',9600)

ihum  = 0       # Index where humidity is
itemp = 1       # Index where temp is

while(True):
    start = timeit.timeit()
    strg = ser.readline().split()
    hum = float(strg[ihum])
    temp = float(strg[itemp])
    print "Humidity: %g \t Temperature: %g \n"%(hum,temp)
    end=timeit.timeit()
    print "Time: %g"%(start-end)
