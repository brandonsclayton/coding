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

import Adafruit_IO as ada
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

sensorIds = [ 
  "temp_hub",
  "temp_sensor00",
  "average"
]

roomIds = [
  "living-room-temperature",
  "bedroom-temperature",
  "average-temperature"
]

ns=2

aio = "3e6def1ef84a4ab2a46968bbf09c150a"
adaClient = ada.Client(aio)
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
    print ('---------------------------------------------------\n')
    msg = msg_ck[1:]          # Get rest of message from the Arduino
    nmsg = len(msg)           # Get length of message
    sensorIdsRead = [];           # Allocate for sensor id
    tempData      = [];           # Allocate for temp 
    
    for js in range(0,nmsg,ns):
      sensorIdsRead.append(msg[js])
      tempData.append(msg[js+1])
    
    avgTemp = 0
    for temp in tempData: 
      avgTemp = float(temp) + avgTemp

    avgTemp = avgTemp/float(len(tempData))   
    avgTemp = '%.2f'%avgTemp
    tempData.append(avgTemp)
    sensorIdsRead.append(sensorIds[-1])

    jt=-1
    for sensorIdRead in sensorIdsRead:
      jr=-1
      jt+=1
      temp = tempData[jt]
      for sensorId in sensorIds: 
        jr+=1
        if sensorIdRead == sensorId:
          data = ada.Data(value=temp)
          adaClient.create_data(roomIds[jr], data)
          print roomIds[jr]+":"+temp

    #--------------- End Make Message to Send --------------------------------

    #....................... Send Message to Artik Cloud ......................
    
    print ('\n Waiting %d seconds'%wait)
    print ('---------------------------------------------------\n\n\n')
    sleep(wait)         # Wait befor proceding to upload another data point
    #----------------- End Send Message to Artik Cloud ------------------------
  
  #--------------------------------------------------------------------------------------
  #
  #######################################################################################


#######################----------------- END ------------- END --------------################################

