var serialport = require('serialport');

var exports = module.exports = {};

var workout = {};
var index = 0;

var stopCountdown = false;
var waitInterval = null;

inputString = "";

exports.split = "";

var uno = new serialport.SerialPort('/dev/uno', { baudRate: 115200 });

uno.on('open', function () {
	console.log('Serial open on /dev/uno');
});

exports.preload = function (data, success, callback) {
	if (data.charAt(0) == '0') {
		workout = {};
	}

	if (data.charAt(data.length - 1) == '*') {
		inputString += data.substring(0, data.length - 1);
		callback(success);
		return;
	} else {
		inputString += data;
	}

	if (inputString.charAt(1) == 'C') {
		index = inputString.charAt(0);
		workout[index] = { color: inputString.substring(2) };
		inputString = "";
		callback(success);
	} else if (inputString.charAt(0) == 'N') {
		inputString = inputString.slice(1);
		workout[index].nodes = inputString.split(',');
		inputString = "";
		callback(success);
	} else if (inputString.charAt(0) == 'D') {
		inputString = inputString.slice(1);
		workout[index].delays = inputString.split(',');
		inputString = "";
		callback(success);
	} else if (inputString.charAt(0) == 'M') {
		workout[index].movementStart = true;
		inputString = "";
		callback(success);
	}
}

exports.stop = function () {
	if (waitInterval != null) {
		stopCountdown = true;
	}
}

exports.play = function (idx) {
	var rep = workout[idx.substring(1)];

	var i = 0;

	var internalCallback = function () {
		uno.write(rep.color + rep.nodes[i]);
		i++;

		if (i == rep.nodes.length) {
			setTimeout(function () { uno.write("000000000000") }, rep.delays[i - 1]);
		} else {
			setTimeout(function () { internalCallback() }, rep.delays[i - 1]);
		}
	}

	if (rep.movementStart) {
		console.log("waiting for split...");
		var localSplit = exports.split;

		waitInterval = setInterval(function () {
			if (localSplit != exports.split || stopCountdown) {
				if (!stopCountdown) {
					clearInterval(waitInterval);
					waitInterval = null;
					internalCallback();
				} else {
					clearInterval(waitInterval);
					waitInterval = null;
					stopCountdown = false;
				}
			}
		}, 25);
	} else {
		internalCallback();
	}
}