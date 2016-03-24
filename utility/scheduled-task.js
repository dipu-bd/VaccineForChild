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
    database.getMessageSchedule(function (err, result) {
        if (err) debug(err);
        if(err || !result) return null;

        result.forEach(function (data) {
            // messege to send
            var messege = data.child + " needs " + data.dose + " of " + data.vaccine
                + ",  within " + (new Date(data.from)).toDateString() +
                " to " + (new Date(data.to)).toDateString() + "\n --VaccineForChild.";

            debug(messege.length);
            debug(messege);

            // send an email
            mailer.sendEmail(data.email, messege, function (err, res) {
                if (err) debug(err);
            });

            // send an sms
            messeger.sendSms(data.phone, messege, function (err, res) {
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