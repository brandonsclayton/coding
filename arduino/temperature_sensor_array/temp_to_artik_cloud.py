#!/bin/python

##################################################
#
#   Connect to Arduino via the serial port,
#   get temperature data and upload it to 
#   the Artik Cloud
#
#
##################################################


###########################################################################
#
#........................ Import ..........................................

import Adafruit_IO as adaio
import sys, getopt
import random, json
from pprint import pprint
import serial
import os
from time import sleep
import urllib3
urllib3.disable_warnings()

os.system('clear')
#------------------------ End Import --------------------------------------
#
###########################################################################



###########################################################################
#
#................... Variables ............................................
arduino='/dev/ttyACM0'                              # Arduino device for serial communication

ac_msg = {}                                         # Dictionary for Artik Cloud messages
   
wait = 30                                           # Time to wait in seconds

room_id = [ "temp_hub",      "living-room-temperature",      
            "temp_sensor00", "bedroom-temperature"]

nroom = len(room_id)
ns=2


aio = "3e6def1ef84a4ab2a46968bbf09c150a"
ada = adaio.Client(aio)
#----------------- End Variables ------------------------------------------
#
###########################################################################



print ('\n\n --------- Connecting -------------- \n\n\n')
ser = serial.Serial(arduino,9600)           # Connect to Arduino

while(True):

  #######################################################################################
  #
  #............ Serial Communication with Arduino and Send to Artik Cloud ................
  
  #.................... Serial Communication with Arduino ...................
  msg = ser.readline().strip()
  msg_ck = msg.split(':')
  #--------------------- End Serial Communication --------------------------
  
  #................... Make Message to Send .................................
  if msg_ck[0] == 'MSG':
    print ('---------------------------------------------------')
    msg = msg_ck[1:]          # Get rest of message from the Arduino
    nmsg = len(msg)           # Get length of message
    sensor_id = [];           # Allocate for sensor id
    temp      = [];           # Allocate for temp 
    
    for js in range(0,nmsg,ns):
      sensor_id.append(msg[js])
      temp.append(msg[js+1])
    
    nt = len(temp)
    avg_temp = 0
    for jt in range(nt):
      avg_temp = float(temp[jt]) + avg_temp

    avg_temp = avg_temp/float(nt)   
    avg_temp = '%.2f'%avg_temp
    ac_msg['average-temperature'] = avg_temp

    print 'Sensor ID: %s '%sensor_id
    print 'Temperature: %s '%temp
    print 'Average Temperature: %s'%avg_temp
    
    jj=0
    for js in range(ns):
      for jr in range(nroom):
        if sensor_id[js] == room_id[jr]: 
          ac_msg[room_id[jr+1]] = temp[js]
          jj=jj+1

    for msg in ac_msg:
      print msg
    print ("\n\nMessage to Send:")
    print (data)

    print ('\nSending message at: ')
    os.system('echo $(date)')
    print ('\n\n')
    #--------------- End Make Message to Send --------------------------------

    #....................... Send Message to Artik Cloud ......................
    
    print ('\n\n Waiting %d seconds'%wait)
    print ('---------------------------------------------------\n\n\n')
    sleep(wait)         # Wait befor proceding to upload another data point
    #----------------- End Send Message to Artik Cloud ------------------------
  
  #--------------------------------------------------------------------------------------
  #
  #######################################################################################


#######################----------------- END ------------- END --------------################################

