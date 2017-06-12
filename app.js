var util = require('util');
var bleno = require('bleno');

var name = 'LightSpeed';
var LightSpeedService = require('./lightspeed-service');

var lightspeedService = new LightSpeedService();

bleno.on('stateChange', function(state){
    if (state === 'poweredOn'){
        bleno.startAdvertising(name, [lightspeedService.uuid], function(err){
            if(err){
                console.log("Error at start advertising: ", err.message);
            }
        });
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function(err){
    if(err){
        console.log("Error at set services: ", err.message);
    } else {
        console.log('advertising...');
        bleno.setServices([lightspeedService]);
    }
});

bleno.on('accept', function(clientAddr){
	console.log("connected to: ", clientAddr);
});

bleno.on('disconnect', function(clientAddr){
	console.log("disconnected from: ", clientAddr);
});
