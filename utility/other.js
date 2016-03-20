var debug = require('debug')('VaccineForChild:user');
var express = require('express');
var database = require('../utility/database');

var MILLIS_IN_DAY = (24 * 3600 * 1000);

/**
 * Get schedules of an specific user
 * @param id ID of the user
 * @param callback
 */
module.exports.getSchedulesOf = function (id, callback) {
    database.getChildrenOf(id, function (err, children) {
        if (children && children.length > 0)
            processChildren(children, callback);
    });
};
module.exports.getSchedules = function (callback) {
    database.getALlChildren(function (err, result) {
        if (result && result.length > 0)
            processChildren(result, callback);
    });
};

function processChildren(children, callback, maxApply) {
    if (!maxApply) maxApply = Number.MAX_VALUE;
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
                var apply_day = (dose.dab - age);
                if (apply_day < 0 || apply_day >= maxApply) continue;
                // build data
                var data = {};
                data.id = child.id;
                data.child = child.name;
                data.dose = dose.name;
                data.vaccine = dose.title;
                data.apply = (new Date()).getTime() + apply_day * MILLIS_IN_DAY;
                //debug(data);
                schedules.push(data);
            }
        }
        // sort schedules by apply date
        schedules.sort(function (a, b) {
            return a.apply - b.apply;
        });
        // send result
        callback(schedules);
    });
}
