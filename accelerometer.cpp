#include <Arduino.h>
#include "accelerometer.h"


Accelerometer::Accelerometer(int xPin, int yPin, int zPin)
{
  pin[X] = xPin;
  pin[Y] = yPin;
  pin[Z] = zPin;

  // initialize to mid-range and allow calibration to
  // find the minimum and maximum for each axis
  for (int i=0; i<3; i++)
  {
    rawMin[i] = 512;
    rawMax[i] = 512;
  }
}


//
// Calculate the net G force given the passed in G vectors
//
float Accelerometer::CalculateNetG(float xg, float yg, float zg)
{
  // the net g force in 3 dimensions can be calculated using the
  // 3D equivalent of the pythagorean theorem
  // d^2 = x^2 + y^2 + z^2
  // d = sqrt(x^2 + y^2 + z^2)
  return sqrt(xg*xg + yg*yg + zg*zg);
}

//
// Find the extreme raw readings from each axis
//
// Accelerometer should be slowly rotated along all axes during this process
// so each axis will see G levels of -1 to 1.
//
void Accelerometer::Calibrate()
{
  int raw;

  for (int i=0; i<3; i++)
  {
    raw = analogRead(pin[i]);

    if (raw < rawMin[i])
    {
      rawMin[i] = raw;
    }

    if (raw > rawMax[i])
    {
      rawMax[i] = raw;
    }
  }
}


//
// Return the current G force along the given axis
//
float Accelerometer::GetG(AXIS axis)
{
  int raw = analogRead(pin[axis]);

  // Convert raw values to 'milli-Gs"
  long scaled = map(raw, rawMin[axis], rawMax[axis], -1000, 1000);
  float accel = scaled / 1000.0;
  return accel;
}


//
// return the current net G force
//
float Accelerometer::GetNetG()
{
  return CalculateNetG(GetG(X), GetG(Y), GetG(Z));
}


void Accelerometer::PrintCalibration()
{
  Serial.print("Raw Ranges: ");

  for (int i=0; i<3; i++)
  {
    Serial.print(rawMin[i]);
    Serial.print("-");
    Serial.print(rawMax[i]);
    Serial.print("  ");
  }
  Serial.println();
}

