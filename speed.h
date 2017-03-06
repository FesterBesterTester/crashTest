#ifndef __speed_h__

class Speed
{
  public:
    Speed();

    // return elapsed time since first tick
    unsigned long getElapsedMs();

    // return average number of ticks per second since first tick
    double getHz();

    // return current number of ticks
    unsigned long getTicks();

    // increment number of ticks
    void tick();

  private:
    unsigned long startMs; // time of first tick
    unsigned long ticks;
};

#endif __speed_h__

