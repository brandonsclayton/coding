
//##############################
//
//........ Include .............
#include <SPI.h>
#include <RH_NRF24.h>
#include <stdio.h>
#include <stdlib.h>
#include <DHT.h>

//------- End Include ----------
//
//##############################


//............... Define ................
#define DHTPIN A0   
#define DHTTYPE DHT11 // DHT 11
//---------------------------------------

//............... Setup .......................

DHT dht(DHTPIN, DHTTYPE);


RH_NRF24 nrf24;
// RH_NRF24 nrf24(8, 10);// For Leonardo, need explicit SS pin
//---------------------------------------------

//............... Variables ....................
long wait = 400;      // Wait time in seconds per temp reading
//---------------------------------------------

void setup() 
{
    Serial.begin(9600);
  
    //................. Transmitter Setup ...............
    while (!Serial);                  // wait for serial port to connect. Needed for Leonardo only
    if (!nrf24.init())
        Serial.println("init failed");  // Defaults after init are 2.402 GHz (channel 2), 2Mbps, 0dBm
    if (!nrf24.setChannel(1))
        Serial.println("setChannel failed");
    if (!nrf24.setRF(RH_NRF24::DataRate2Mbps, RH_NRF24::TransmitPower0dBm))
        Serial.println("setRF failed");    
//-----------------------------------------------

//.................. Temperature Sensor Setup .................
    dht.begin();
//-------------------------------------------------------------

}


void loop()
{
    char temp_str[6];
    char hum_str[6];
 	char msg[50];

    float hum = dht.readHumidity();
    float temp = dht.readTemperature();
    temp=temp*9/5+32;

// check if returns are valid, if they are NaN (not a number) then something went wrong!
    if (isnan(temp) || isnan(hum))
    {
        Serial.println("Failed to read from DHT");
    }
    else
    {
        dtostrf(hum,5,2,hum_str);
        dtostrf(temp,5,2,temp_str);
        
        sprintf(msg,"Living Room:%s,%s",temp_str,hum_str);
    	Serial.println("Sending message:");
        Serial.println(msg);
        Serial.print("\n\n");

        nrf24.send((uint8_t*)msg, strlen(msg)+1);
    	nrf24.waitPacketSent();
        
        delay(wait);         // Wait
    }



  
  
}

