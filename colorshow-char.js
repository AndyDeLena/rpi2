var util = require('util');
var bleno = require('bleno');
var colorshow = require('./colorshow');

function ColorShowCharacteristic() {
    bleno.Characteristic.call(this, {
        uuid: '05247724-C5F5-46DE-A4E5-8E5857519D12',
        properties: ['write']
    });
}

util.inherits(ColorShowCharacteristic, bleno.Characteristic);

ColorShowCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
    var request = data.toString();
    if (request.charAt(0) == 'S') {
        colorshow.play(request);
        callback(this.RESULT_SUCCESS);
    } else if (request.charAt(0) == 'P') {
        colorshow.stop();
        callback(this.RESULT_SUCCESS);
    } else {
        colorshow.preload(request, this.RESULT_SUCCESS, callback);
    }
}

module.exports = ColorShowCharacteristic;


