
#ifndef __accelerometer_h__
#define __accelerometer_h__


class Accelerometer
{
  public:
    enum AXIS {X=0, Y=1, Z=2};

    Accelerometer(int xPin, int yPin, int zPin);
    static float CalculateNetG(float xg, float yg, float zg);
    void Calibrate();
    float GetG(AXIS axis);
    float GetNetG();
    void PrintCalibration();

  private:
    // which arduino pin is each axis connected to?
    int pin[3];

    // Ranges for each axis found during calibration
    int rawMin[3];
    int rawMax[3];
};


#endif // __accelerometer_h__

