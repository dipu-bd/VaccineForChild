
var twilio = require('twilio');

module.exports.sendSms = function(number, sms, callback){
    var client = new twilio.RestClient(
        'ACa9f83d7e9b9706acd71203ffd18693e7',
        '344e9f12ca318c4654f75911fd363bfc'
    );

    client.sms.messages.create({
        to: number,
        from: '+18443999568',
        body: sms
    }, function(error, message){
        if(error){
            console.log(error);
        } else{
            return console.log('message sent to ' + number);
        }
    });

}
