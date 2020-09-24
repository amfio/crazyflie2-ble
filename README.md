# crazyflie2-ble
## About
A [NodeJS](https://nodejs.org) library for communicating with [Crazyflie 2.0](https://www.bitcraze.io/crazyflie-2/) quadcopters over Bluetooth Low Energy (BLE).

## Installation
`npm i crazyflie2-ble`

## Usage
### Connecting the Crazyflie 2
You can eiter use promises:

```javascript
var CF2 = require('crazyflie2-ble');

CF2.getConnection().then(function (crazyflie) {
  // Communicate with quadcopter
}).catch(function (error) {
  // Something went wrong :(
});
```

Or you can use callbacks:

```javascript
var CF2 = require('crazyflie2-ble');

CF2.getConnection(function (error, crazyflie) {
  if (error) {
    // Something went wrong :(
    return;
  } else {
    // Communicate with quadcopter
  }
});
```

### Controlling the Crazyflie 2
`setThrust(thrust)`

`setYaw(yaw)`

`setRoll(roll)`

`setPitch(pitch)`


Don't forget that you need to initially set the thrust to zero before you can take control of the quadcopter. This is a safety mechanism built into the Crazyflie itself to make sure your quadcopter doesn't immediately fly off as soon as you turn the quadcopter on!

```javascript
var CF2 = require('crazyflie2-ble');

CF2.getConnection().then(function (crazyflie) {
  // initially set the thrust to zero - this must always be done before any flying can commence
  crazyflie.setThrust(0);
  
  // after 1 second, set the thrust to 20000 (about 30% power)
  setTimeout(function () {
    crazyflie.setThrust(2000);
  }, 1000);

  // after further 2 seconds (total of 3 seconds), set the thrust back to 0
  setTimeout(function () {
    crazyflie.setThrust(0);
  }, 3000);
}).catch(function (error) {
  // Something went wrong :(
});
```
