#include "accelerometer.h"
#include "speed.h"


Accelerometer accelerometer(A0, A1, A2);
Speed speed;


void setup()
{
  analogReference(EXTERNAL);
  Serial.begin(250000);
}


void loop()
{
  static bool calibrate = false;
  static bool calibrated = false;
  static float maxNet = 1.0;
  static float minNet = 1.0;


  if (Serial.available())
  {
    char command = Serial.read();
    switch (command)
    {
      case 'c':
        Serial.println("Calibrating");
        calibrate = true;
        break;

      case 'e':
        Serial.println("End calibration");
        calibrate = false;
        calibrated = true;
        accelerometer.PrintCalibration();
        break;

      case 's':
      {
        Serial.print("Speed at ");
        Serial.print(speed.getElapsedMs()/1000);
        Serial.print(" seconds: ");
        Serial.print(speed.getHz());
        Serial.print(" Hz (");
        Serial.print(speed.getTicks());
        Serial.println(" loop iterations)");
        break;
      }

      default:
        Serial.println("h - help");
        Serial.println("c - calibrate");
        Serial.println("e - end calibration");
        Serial.println("s - print avg loop iterations per second");
        break;
    }
  }


  if (calibrate)
  {
    accelerometer.Calibrate();
  }
  else if (calibrated)
  {
  /*
    float xAccel = accelerometer.GetG(Accelerometer::AXIS::X);
    float yAccel = accelerometer.GetG(Accelerometer::AXIS::Y);
    float zAccel = accelerometer.GetG(Accelerometer::AXIS::Z);
  */
    float netAccel = accelerometer.GetNetG();

    speed.tick();

    if (netAccel > maxNet) { maxNet = netAccel; Serial.print("Max net: "); Serial.println(maxNet); }
    if (netAccel < minNet) { minNet = netAccel; Serial.print("Min net: "); Serial.println(minNet); }
/*
    Serial.print(xAccel);
    Serial.print(", ");
    Serial.print(yAccel);
    Serial.print(", ");
    Serial.print(zAccel);
    Serial.print(": ");
    Serial.println(netAccel);
*/
  }
}

