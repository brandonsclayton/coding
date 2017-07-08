
//##############################
//
//........ Include .............
#include <Wire.h>
#include "Adafruit_MCP9808.h"
//------- End Include ----------
//
//##############################



// ................ Setup ......................
sensor = "temp_sensor00";
Adafruit_MCP9808 temp_sensor = Adafruit_MCP9808();
//----------------------------------------------

//............... Variables ....................
long wait = 1000;      // Wait time in mili seconds per temp reading
//---------------------------------------------



void setup() 
{
  Serial.begin(9600);

  /*
  //................. Transmitter Setup ...............
  while (!Serial);                  // wait for serial port to connect. Needed for Leonardo only
  if (!nrf24.init())
    Serial.println("init failed");  // Defaults after init are 2.402 GHz (channel 2), 2Mbps, 0dBm
  if (!nrf24.setChannel(1))
    Serial.println("setChannel failed");
  if (!nrf24.setRF(RH_NRF24::DataRate2Mbps, RH_NRF24::TransmitPower0dBm))
    Serial.println("setRF failed");    
  //-----------------------------------------------
  */

  //.................. Temperature Sensor Setup .................
  if (!temp_sensor.begin())
  {
    Serial.println("Could not find temperature sensor");
    while(1);
  }
  //-------------------------------------------------------------

}


void loop()
{
  char temp_str[6];                       // String to hold temp 
 	char msg[50];                           // String to hold message to send

  float temp = temp_sensor.readTempC();   // Read in temperature in C
  temp=temp*9.0/5.0+32.0;                       // Convert to F
  
  
  // check if returns are valid, if they are NaN (not a number) then something went wrong!
  if (isnan(temp) || isnan(hum))
  {
      Serial.println("Failed to read from temp_sensor00");
  }
  else
  {
    dtostrf(temp,5,2,temp_str);
  
    sprintf(msg,"%s: %s",sensor,temp_str);
    Serial.println("Message: ");
    Serial.println(msg);
    Serial.print("\n\n");

    //nrf24.send((uint8_t*)msg, strlen(msg)+1);
    //nrf24.waitPacketSent();
      
    delay(wait);         // Wait
  }
  
}

