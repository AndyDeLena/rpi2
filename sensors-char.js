var util = require('util');
var bleno = require('bleno');
var colorshow = require('./colorshow');

var serialport = require('serialport');
var feather = new serialport.SerialPort('/dev/feather', { baudRate: 115200 });

thisSplit = "";
lastSplit = "";

feather.on('open', function () {
	console.log('Serial port open on /dev/feather');
});

feather.on('data', function (data) {
	thisSplit = String.fromCharCode.apply(null, new Uint8Array(data));
	colorshow.split = thisSplit;
});

function SensorsCharacteristic() {
	bleno.Characteristic.call(this, {
		uuid: 'A174FAD0-51A4-441A-B789-5C514FC33879',
		properties: ['notify'],
		onSubscribe: function (maxValueSize, updateValueCallback) {
			console.log("Subscribe successful");
			thisSplit = "";
			lastSplit = "";
			this.splitInt = setInterval(function () {
				if (thisSplit != lastSplit) {
					updateValueCallback(new Buffer(thisSplit));
					lastSplit = thisSplit;
				}
			}, 50);
		},
		onUnsubscribe: function(){
			console.log("Unsubscribe successful");
			clearInterval(this.splitInt);
		}
	});
}

util.inherits(SensorsCharacteristic, bleno.Characteristic);

module.exports = SensorsCharacteristic;


