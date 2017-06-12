var bleno = require('bleno');
var util = require('util');

var ColorShowChar = require('./colorshow-char.js');
var SensorsChar = require('./sensors-char.js');

function LightSpeedService() {
    bleno.PrimaryService.call(this, {
        uuid: '01B6A25D-12A1-42EF-9550-A60066D40310',
        characteristics: [
            new ColorShowChar(),
	        new SensorsChar()
        ]
    });
}

    util.inherits(LightSpeedService, bleno.PrimaryService);

    module.exports = LightSpeedService;
