#ifndef __speed_h__

class Speed
{
  public:
    Speed();
    unsigned long getElapsedMs();
    double getHz();
    unsigned long getTicks();
    void tick();

  private:
    unsigned long startMs;
    unsigned long ticks;
};

#endif __speed_h__

