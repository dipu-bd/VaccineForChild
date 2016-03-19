var debug = require('debug')('VaccineForChild:user');
var express = require('express');
var database = require('../utility/database');

module.exports.getSchedules = function (id, callback) {
    var MILLIS_IN_DAY = (24 * 3600 * 1000);
    database.getChildren(id, function (err, children) {
        if (err) return null;
        // get all dose above minAge age
        database.getAllDoses(function (err, doses) {
            if (err) return null;
            // calculate schedules
            var schedules = [];
            for (var j = 0; j < doses.length; ++j) {
                var dose = doses[j];
                for (var i = 0; i < children.length; ++i) {
                    var child = children[i];
                    // calculate child's age in day
                    var age = ((new Date()).getTime() - child.dob) / MILLIS_IN_DAY;
                    // check if applicable
                    if (dose.dab < age) continue;
                    // build data
                    var data = {};
                    data.id = child.id;
                    data.child = child.name;
                    data.dose = dose.name;
                    data.vaccine = dose.title;
                    data.apply = (new Date()).getTime() + (dose.dab - age) * MILLIS_IN_DAY;
                    //debug(data);
                    schedules.push(data)
                }
            }
            // sort schedules by date
            schedules.sort(function (a, b) {
                return a.apply - b.apply;
            });
            // send result
            callback(schedules);
        });
    });
};
