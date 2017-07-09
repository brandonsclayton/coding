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
import artikcloud
from artikcloud.rest import ApiException
import sys, getopt
import time, random, json
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

device_id = '1497d25089db4a8d84997fd5b2a3d65f'      # Arduino device ID for Artik cloud
device_token = '17d85311bc7f46519a75a5138c46f221'   # Arduino device token for Artik cloud

ac_msg = {}                                         # Dictionary for Artik Cloud messages
   
wait = 90                                           # Time to wait in seconds

room_id = [ "temp_hub",      "Living_Room_Temperature",      
            "temp_sensor00", "Bedroom_Temperature"]

nroom = len(room_id)
ns=2

#----------------- End Variables ------------------------------------------
#
###########################################################################



###########################################################################
#
#................... Setup Artik Cloud Communication ......................
artikcloud.configuration = artikcloud.Configuration()       # Configure Artik Cloud
artikcloud.configuration.access_token = device_token        # Set device token
device_sdid = device_id                                     # Set device id
api_instance = artikcloud.MessagesApi()                     # Get messaging API
#------------- End Artik Cloud Communication Setup ------------------------
#
###########################################################################

print '\n\n --------- Connecting -------------- \n\n\n'

while(True):

  #######################################################################################
  #
  #............ Serial Communication with Arduino and Send to Artik Cloud ................
  
  #.................... Serial Communication with Arduino ...................
  ser = serial.Serial(arduino,9600)           # Connect to Arduino
  msg = ser.readline().strip()
  msg_ck = msg.split(':')
  #--------------------- End Serial Communication --------------------------
  
  #................... Make Message to Send .................................
  if msg_ck[0] == 'MSG':
    print '---------------------------------------------------'
    msg = msg_ck[1:]          # Get rest of message from the Arduino
    nmsg = len(msg)           # Get length of message
    sensor_id = [];           # Allocate for sensor id
    temp      = [];           # Allocate for temp 
    for js in range(0,nmsg,ns):
      sensor_id.append(msg[js])
      temp.append(msg[js+1])
  
    print 'Sensor ID: %s '%sensor_id
    print 'Temperature: %s '%temp

    jj=0
    for js in range(ns):
      for jr in range(nroom):
        if sensor_id[js] == room_id[jr]: 
          ac_msg[room_id[jr+1]] = temp[js]
          jj=jj+1

    ts = None                                             # Custom time stamp
    data = artikcloud.Message(ac_msg, device_sdid, ts)    # Construct a Message object

    print "\n\nMessage to Send:"
    print data

    print '\nSending message at: '
    os.system('echo $(date)')
    print '\n\n'
    #--------------- End Make Message to Send --------------------------------

    #....................... Send Message to Artik Cloud ......................
    try: 
      # Debug Print oauth settings
      pprint(artikcloud.configuration.auth_settings())

      # Send Message
      api_response = api_instance.send_message(data)
      pprint(api_response)
    except ApiException as e:
      pprint("Exception when calling MessagesApi->send_message: %s\n" % e)
    
    
    print '\n\n Waiting %d seconds'%wait
    print '---------------------------------------------------\n\n\n'
    sleep(wait)         # Wait befor proceding to upload another data point
    #----------------- End Send Message to Artik Cloud ------------------------
  
  #--------------------------------------------------------------------------------------
  #
  #######################################################################################

    



#######################----------------- END ------------- END --------------################################

