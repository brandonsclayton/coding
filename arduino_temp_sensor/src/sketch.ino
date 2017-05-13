
#include <stdio.h>
#include <stdlib.h>
#include <DHT.h>

#define DHTPIN A0 // what pin we're connected to

// Uncomment whatever type you're using!
#define DHTTYPE DHT11 // DHT 11
//#define DHTTYPE DHT22 // DHT 22 (AM2302)
//#define DHTTYPE DHT21 // DHT 21 (AM2301)

// Connect pin 1 (on the left) of the sensor to +5V
// Connect pin 2 of the sensor to whatever your DHTPIN is
// Connect pin 4 (on the right) of the sensor to GROUND
// Connect a 10K resistor from pin 2 (data) to pin 1 (power) of the sensor

DHT dht(DHTPIN, DHTTYPE);

long wait = 15*60*1000L;      // Wait time in mintues per temp reading


void setup()
{
    Serial.begin(9600);

    dht.begin();
}

void loop()
{
    // Reading temperature or humidity takes about 250 milliseconds!
    // Sensor readings may also be up to A0 seconds 'old' (its a very slow sensor)
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
        //Serial.print("Humidity: ");
        Serial.print(hum);
        Serial.print(" ");
        //Serial.print("Temperature: ");
        Serial.println(temp);
        //Serial.println(" *F");
        //Serial.print(" ");
        //Serial.println(wait);
        delay(wait);         // Wait
    
    }

}
