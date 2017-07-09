
// Sensor ID: temp_hub
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
char sensor_id[] = "temp_hub";          // Sensor id 

char temp_str[6];                       // String to hold temp 
char msg[50];                           // String to hold message to send
char err[100];                          // String to hold an error message

long wait = 1000;                       // Wait time in mili seconds per temp reading

Adafruit_MCP9808 temp_sensor = Adafruit_MCP9808();

#define RF69_FREQ 915.0                 // Frequency of transceiver
#define RFM69_CS 4                      // Pin on Leonardo for CS
#define RFM69_INT 7                     // Pin on Leonardo for INT
#define RFM69_RST 5                     // Pin on Leonardo for RST

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
  
  //................... If Values is Good Make Message ...............
  else
  {
    dtostrf(temp,5,2,temp_str);                       // Convert temperature to a string
  
    sprintf(msg,"%s: %s",sensor_id,temp_str);         // Make a string for the message to be sent
    Serial.println("Hub message: ");                      // Print message to serial to check 
    Serial.println(msg);
    Serial.print("\n\n");
    
  }
  //------------------------------------------------------------------
  
  //..................... Get Message ................................
  if (rf69.available())
  {
    char *sensor_id_msg;
    char *temp_msg;

    // Should be a message for us now   
    uint8_t buf[RH_RF69_MAX_MESSAGE_LEN];
    uint8_t len = sizeof(buf);

    if (rf69.recv(buf, &len))
    {
      sensor_id_msg = strtok((char*)buf,":");
      temp_msg = strtok(NULL,",");

      Serial.print("Sensor Msg: ");
      Serial.println(sensor_id_msg);
      Serial.print("Temperature Msg: ");
      Serial.println(temp_msg);
      
      
      char art_msg[500];
      sprintf(art_msg,"MSG:%s:%s:%s:%s",sensor_id,temp_str,sensor_id_msg,temp_msg);
      Serial.print(art_msg);
      Serial.print("\n\n");

    }
    else{Serial.println("recv failed");}
  }
  //------------------------------------------------------------------
  
  
  delay(wait);

}
//------------------------ End Main Loop ------------------------------
//
//#####################################################################

