#include <Arduino.h>
#include "speed.h"


Speed::Speed()
{
  startMs = 0;
  ticks = 0;
}


// return elapsed time since first tick
unsigned long Speed::getElapsedMs()
{
  return startMs ? millis() - startMs : 0;
}


// return average number of ticks per second since first tick
double Speed::getHz()
{
  double elapsedSeconds = getElapsedMs()/1000.0;

  return elapsedSeconds ? ticks/elapsedSeconds : 0.0;
}


// return current number of ticks
unsigned long Speed::getTicks()
{
  return ticks;
}


// increment number of ticks
void Speed::tick()
{
  ticks++;

  if (!startMs)
  {
    startMs = millis();
  }
}


