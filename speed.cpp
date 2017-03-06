#include <Arduino.h>
#include "speed.h"


Speed::Speed()
{
  startMs = 0;
  ticks = 0;
}


unsigned long Speed::getElapsedMs()
{
  return millis() - startMs;
}


double Speed::getHz()
{
  double elapsedSeconds = getElapsedMs()/1000.0;

  return ticks/elapsedSeconds;
}


unsigned long Speed::getTicks()
{
  return ticks;
}


void Speed::tick()
{
  ticks++;

  if (!startMs)
  {
    Serial.println("initial tick");
    startMs = millis();
  }
}


