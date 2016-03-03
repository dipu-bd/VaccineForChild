var express = require('express');
var database = require('./../database');
var debug = require('debug')('VaccineForChild:home');

var router = express.Router();

// Property table as resource
var resource = require('../resource/property')();

/* GET home page. */
router.get('/', function (req, res, next) {
    database.getUserById(req.cookies['SessionID'], function (err, result) {
        if (result) { // logged in
            resource.user = result;
            if (result.access > 0) { // access type : administrators
                res.render('home-admin', resource);
            } else {    // access type: general user.
                res.render('home-general', resource);
            }
        } else { // not logged in
            resource.user = null;
            res.render('home-default', resource);
        }
    });
});

module.exports = router;
