var express = require('express');
var database = require('./../database');
var debug = require('debug')('VaccineForChild:profile');

var router = express.Router();

// Property table as resource
var resource = require('../resource/property')();

/* GET home page. */
router.get('/', function (req, res, next) {
    database.getUserById(req.cookies['SessionID'], function (err, result) {
        resource.user = result;
        if (result) { // logged in
            res.render('profile', resource);
        } else {
            res.send(404);
        }
    });
});


module.exports = router;
