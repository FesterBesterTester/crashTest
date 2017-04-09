import sys
import re
from threading import Lock
from collections import deque
from http.server import SimpleHTTPRequestHandler, HTTPServer
from socketserver import ThreadingMixIn
import threading
import argparse
import serial


MAX_READINGS = 1000

class AccelerometerReadings(object):
    def __init__(self):
      self.readings = deque(maxlen=MAX_READINGS)
      self.lock = Lock()

accelReadings = AccelerometerReadings()

class HTTPRequestHandler(SimpleHTTPRequestHandler):
  def do_POST(self):
    if None != re.search('/api/v1/addrecord/*', self.path):
      ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
      if ctype == 'application/json':
        length = int(self.headers.getheader('content-length'))
        data = cgi.parse_qs(self.rfile.read(length), keep_blank_values=1)
        recordID = self.path.split('/')[-1]
        LocalData.records[recordID] = data
        print("record %s is added successfully" % recordID)
      else:
        data = {}
      self.send_response(200)
      self.end_headers()
    else:
      self.send_response(403)
      self.send_header('Content-Type', 'application/json')
      self.end_headers()
    return

  def do_GET(self):
    if None != re.search('/api/v1/getrecord/*', self.path):
      recordID = self.path.split('/')[-1]
      if True:
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        reading_json = '['

        accelReadings.lock.acquire()
        for reading in accelReadings.readings:
          # reading = accelReadings.readings.popleft() # AccelerometerReadings.readings.popleft()
          reading_json += '{"time": ' + str(reading[0]) + ', "x": ' + str(reading[1]) + ', "y": ' + str(reading[2]) + ', "z": ' + str(reading[3]) + '},'

        reading_json = reading_json[0:-1] # strip trailing ','
        reading_json += ']'
        accelReadings.lock.release()
        self.wfile.write(reading_json.encode('utf-8'))

      else:
        self.send_response(400, 'Bad Request: record does not exist')
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
    else:
      super(HTTPRequestHandler, self).do_GET()

    return


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
  allow_reuse_address = True

  def shutdown(self):
    self.socket.close()
    HTTPServer.shutdown(self)


class SimpleHttpServer():
  def __init__(self, ip, port):
    self.server = ThreadedHTTPServer((ip, port), HTTPRequestHandler)

  def start(self):
    self.server_thread = threading.Thread(target=self.server.serve_forever)
    self.server_thread.daemon = True
    self.server_thread.start()

  def waitForThread(self):
    self.server_thread.join()

  def addRecord(self, rec):
    accelReadings.lock.acquire()
    accelReadings.readings.append(rec) # AccelerometerReadings.readings.append(rec)
    accelReadings.lock.release()

  def stop(self):
    self.server.shutdown()
    self.waitForThread()


if __name__=='__main__':
  parser = argparse.ArgumentParser(description='HTTP Server')
  parser.add_argument('-p', dest='ipPort', type=int, help='Listening port for HTTP Server', required=True)
  parser.add_argument('-a', dest='ip', help='HTTP Server IP', required=True)
  parser.add_argument('-s', dest='serialPort', help='Serial Port', required=True)
  args = parser.parse_args()

  server = SimpleHttpServer(args.ip, args.ipPort)
  print('HTTP Server Running...........')
  server.start()

  serPort = serial.Serial(args.serialPort, 250000, timeout=1)

  while True:
    line = sys.stdin.readline().strip().encode()
    serPort.write(line)
    print(line)
    if (line == b'l'):
        break

    while True:
        serLine = serPort.readline()
        if (serLine == b''):
            break
        print(serLine.decode('utf-8'))


  while True:
      line = serPort.readline()
      data = [float(val) for val in line.split()]
      server.addRecord(data)

  server.waitForThread()

