# crazyflie2-ble
## About
A [NodeJS](https://nodejs.org) library for communicating with [Crazyflie 2.0](https://www.bitcraze.io/crazyflie-2/) quadcopters over Bluetooth Low Energy (BLE).

## Installation
Clone the repository into your 'node_modules' folder.

`git clone https://github.com/amfio/crazyflie2-ble`

Install the dependencies

`npm install`

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

```javascript
	var CF2 = require('crazyflie2-ble');

	CF2.getConnection().then(function (crazyflie) {
	  	crazyflie.setThrust(20000);

	  	setTimeout(function () {
	  		crazyflie.setThrust(0);
  		}, 2000)
	}).catch(function (error) {
		// Something went wrong :(
	});
```
