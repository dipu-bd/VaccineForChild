var debug = require('debug')('VaccineForChild:user');
var express = require('express');
var database = require('../utility/database');

var MESSAGE_INTERVAL_PERIOD = (6 * 3600 * 1000); // every 6 hours

var startPeriodicMesseging = function () {
    setInterval(function () {
        database.getMessageSchedule(function (data) {

        });
    }, MESSAGE_INTERVAL_PERIOD);
};

module.exports.startPeriodicMesseging = startPeriodicMesseging;