var debug = require('debug')('VaccineForChild:scheduled-task');
var express = require('express');
var database = require('../utility/database');
var messeger = require('../utility/messeger');
var mailer = require('../utility/mailer');

var MESSAGE_INTERVAL_PERIOD = (12 * 3600 * 1000); // every 12 hours

var startPeriodicMesseging = function () {
    checkAndInformAll();
    setInterval(checkAndInformAll, MESSAGE_INTERVAL_PERIOD);
};

function checkAndInformAll() {
    // check if time is correct
    var curHour = (new Date()).getHours();
    if (!(curHour >= 8 && curHour <= 21)) // 9am to 10pm
    {
        debug('Time is not right for this task. - ' + curHour);
        return;
    }
    // query database and start sending messege
    database.getMessageSchedule(function (err, result) {
        if (err) debug(err);
        if (err || !result) return null;

        result.forEach(function (data) {
            // message to send
            var message = data.child + " needs " + data.dose + " of " + data.vaccine
                + ",  within " + (new Date(data.from)).toDateString() +
                " to " + (new Date(data.to)).toDateString() + "\n --VaccineForChild.";

            debug(message.length);
            debug(message);

            // send an email
            mailer.sendEmail(data.email, message, function (err, res) {
                if (err) debug(err);
            });

            // send an sms
            messeger.sendSms(data.phone, message, function (err, res) {
                if (err) debug(err);
                else {
                    database.setInformed(data.user, function (errors) {
                        if (errors) debug(errors);
                        else debug('Informed about ' + data.child);
                    })
                }
            });
        });
    });
}

module.exports.startPeriodicMesseging = startPeriodicMesseging;