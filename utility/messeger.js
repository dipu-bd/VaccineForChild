var debug = require('debug')('VaccineForChild:messeger');
var twilio = require('twilio');

var sendSms = function (number, sms, callback) {
    var client = new twilio.RestClient(
        'ACa9f83d7e9b9706acd71203ffd18693e7',
        '344e9f12ca318c4654f75911fd363bfc'
    );

    client.sms.messages.create({
        to: number,
        from: '+18443999568',
        body: sms
    }, callback);
};

module.exports.sendSms = sendSms;