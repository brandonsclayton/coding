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

msg = {}                                            # Dictionary for messages
   
wait = 60                                           # Time to wait in seconds
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


print '\n\n Connecting \n\n'

while(True):

    ###########################################################################
    #
    #.................... Serial Communication with Arduino ...................
    ser = serial.Serial(arduino,9600)           # Connect to Arduino

    room=ser.readline().strip()                 # Get room of sensor
    temp=ser.readline().strip()                 # Get temperature of that room
    hum= ser.readline().strip()                 # Get humidity of that room 

    print 'Room: %s '%room
    print 'Temperature: %s '%temp
    print 'Humidity: %s \n'%hum

    #--------------------- End Serial Communication --------------------------
    #
    ###########################################################################


    ###########################################################################
    #
    #................... Make Message to Send .................................

    msg['Temperature'] = temp
    msg['Humidity']    = hum

    ts = None                                           # Custom time stamp

    data = artikcloud.Message(msg, device_sdid, ts)     # Construct a Message object

    print "\n\n Message: \n"
    print data
    print "\n\n"

    #--------------- End Make Message to Send --------------------------------
    #
    ###########################################################################


    ###########################################################################
    #
    #....................... Send Message to Artik Cloud ......................

    try: 
        # Debug Print oauth settings
        pprint(artikcloud.configuration.auth_settings())

        # Send Message
        api_response = api_instance.send_message(data)
        pprint(api_response)
    except ApiException as e:
        pprint("Exception when calling MessagesApi->send_message: %s\n" % e)

    #----------------- End Send Message to Artik Cloud ------------------------
    #
    ###########################################################################

    print '\n\n Waiting %d seconds \n\n\n\n'%wait
    sleep(wait)         # Wait befor proceding to upload another data point
    



#######################----------------- END ------------- END --------------################################

