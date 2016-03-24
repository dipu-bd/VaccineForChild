var debug = require('debug')('VaccineForChild:user');
var express = require('express');
var database = require('../utility/database');
var messeger = require('../utility/messeger');
var mailer = require('../utility/mailer');

var MESSAGE_INTERVAL_PERIOD = (6 * 3600 * 1000); // every 6 hours

var startPeriodicMesseging = function () {
    setInterval(function () {
        database.getMessageSchedule(function (err, res) {
            debug(err);
            res.forEach(function (data) {
                // messege to send
                var messege = "Please bring your child, " + data.child + ", " +
                    "to the nearest child care center for '" + data.dose + "' of '" +
                    data.vaccine + "',  any time between '" + (new Date(data.from)).toDateString() +
                    "' and '" + (new Date(data.to)).toDateString() + "'.   - VaccineForChild.";

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
    }, MESSAGE_INTERVAL_PERIOD);
};

module.exports.startPeriodicMesseging = startPeriodicMesseging;