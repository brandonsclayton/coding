
// Sensor ID: temp_sensor00
// Board:     Leonardo


//##############################
//
//........ Include .............
#include <Wire.h>
#include "Adafruit_MCP9808.h"

#include <SPI.h>
#include <RH_RF69.h>
//------- End Include ----------
//
//##############################


//#####################################################################
//
//............................ Variables ..............................
char sensor_id[] = "temp_sensor00";     // Sensor id 

char temp_str[6];                       // String to hold temp 
char msg[50];                           // String to hold message to send
char err[100];                          // String to hold an error message

long wait = 1000;                       // Wait time in mili seconds per temp reading

Adafruit_MCP9808 temp_sensor = Adafruit_MCP9808();

#define RF69_FREQ 915.0
#define RFM69_CS 4
#define RFM69_INT 7
#define RFM69_RST 5

RH_RF69 rf69(RFM69_CS, RFM69_INT);

//------------------------ End Variables ------------------------------
//
//#####################################################################


//#####################################################################
//
//............................ Main Setup .............................
void setup() 
{
  Serial.begin(9600);

  //................. Transmitter Setup ...............
  //while (!Serial) { delay(1); } // wait until serial console is open, remove if not tethered to computer
	pinMode(RFM69_RST, OUTPUT);
  digitalWrite(RFM69_RST, LOW);
	digitalWrite(RFM69_RST, HIGH);
  delay(10);
  digitalWrite(RFM69_RST, LOW);
  delay(10);
	
  if (!rf69.init()) 
	{
    Serial.println("RFM69 radio init failed");
    while (1);
  }
  Serial.println("RFM69 radio init OK!");
  
  // Defaults after init are 434.0MHz, modulation GFSK_Rb250Fd250, +13dbM (for low power module)
  // No encryption
  if (!rf69.setFrequency(RF69_FREQ)) 
  {
    Serial.println("setFrequency failed");
  }
 
  // If you are using a high power RF69 eg RFM69HW, you *must* set a Tx power with the
  // ishighpowermodule flag set like this:
  rf69.setTxPower(20, true);  // range from 14-20 for power, 2nd arg must be true for 69HCW
	//-----------------------------------------------

  //.................. Temperature Sensor Setup .................
  if (!temp_sensor.begin())
  {
    Serial.println("Could not find temperature sensor");
    while(1);
  }
  //-------------------------------------------------------------

}
//------------------------ End Main Setup -----------------------------
//
//#####################################################################




//#####################################################################
//
//............................ Main Loop .............................
void loop()
{

  //.................. Read in Temperature Sensor ....................
  float temp = temp_sensor.readTempC();               // Read in temperature in C
  temp=temp*9.0/5.0+32.0;                             // Convert temperature to F
  //------------------------------------------------------------------
  
  //.................. Check Temperature Value .......................
  if (isnan(temp))                                    // Check if temperature value is valid, if NaN then return error message
  {
    sprintf(err,"Failed to read from %s",sensor_id);  // Make error message
    Serial.println(err);                              // Print message 
  }
  //------------------------------------------------------------------
  
  //................... If Values is Good Send Message ...............
  else
  {
    dtostrf(temp,5,2,temp_str);                       // Convert temperature to a string
  
    sprintf(msg,"%s: %s",sensor_id,temp_str);         // Make a string for the message to be sent
    Serial.println("Message: ");                      // Print message to serial to check 
    Serial.println(msg);
    Serial.print("\n\n");

    rf69.send((uint8_t*)msg, strlen(msg)+1);
    rf69.waitPacketSent();
      
    delay(wait);                                      // Delay for next temperature measurment
  }
  //------------------------------------------------------------------
  
}
//------------------------ End Main Loop ------------------------------
//
//#####################################################################

