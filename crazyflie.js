'use strict';

var Promise = require('bluebird');
var noble = require('noble');
var bufferpack = require('bufferpack');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var SERVICE_UUID = '000002011c7f4f9e947b43b7c00a9a08';
var CHARACTERISTIC_UUID = '000002021c7f4f9e947b43b7c00a9a08';
var UPS = 10; //updates to quadcopter per second

function Crazyflie(peripheral, characteristic) {
  var _this = this;
  var updateInterval = null;
  var thrust = 0;
  var yaw = 0;
  var pitch = 0;
  var roll = 0;

  function update() {
    var buffer = bufferpack.pack('<BfffH', [0x30, roll, pitch, yaw, thrust]);
    characteristic.write(buffer, false);
  }

  function startUpdates() {
    updateInterval = setInterval(update, 1000 / UPS);
  }

  function stopUpdates() {
    clearInterval(updateInterval);
  }

  _this.disconnect = function () {
    stopUpdates();
    peripheral.removeAllListeners();
    _this.emit('disconnect');
  };

  _this.setThrust = function (value) {
    thrust = value;
  };

  _this.setYaw = function (value) {
    yaw = value;
  };

  _this.setPitch = function (value) {
    pitch = value;
  };

  _this.setRoll = function (value) {
    roll = value;
  };

  peripheral.on('disconnect', _this.disconnect);
  startUpdates();
}

util.inherits(Crazyflie, EventEmitter);

function getConnection() {
  return new Promise(function (resolve, reject) {
    noble.on('stateChange', function (state) {
      if (state === 'poweredOn') {
        noble.startScanning();
      }
    });

    noble.on('discover', function (peripheral) {
      if (peripheral.advertisement.localName !== 'Crazyflie') {
        return;
      }

      Promise.promisifyAll(peripheral);

      return peripheral.connectAsync().then(function () {
        return peripheral.discoverServicesAsync([SERVICE_UUID]);
      }).then(function (services) {
        if (services.length === 0) {
          return Promise.reject('No services discovered');
        }

        Promise.promisifyAll(services[0]);
        return services[0].discoverCharacteristicsAsync([CHARACTERISTIC_UUID]);
      }).then(function (characteristics) {
        if (characteristics.length === 0) {
          return Promise.reject('No characteristics discovered');
        }

        return new Crazyflie(peripheral, characteristics[0]);
      }).done(function (crazyflie) {
        resolve(crazyflie);
      });
    });

  }).finally(function () {
    noble.startScanning();
    noble.removeAllListeners();
  });
}


module.exports = {
  getConnection: function (callback) {
    return getConnection().nodeify(callback);
  }
};
