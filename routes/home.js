var express = require('express');
var database = require('./../database');
var debug = require('debug')('VaccineForChild:home');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    database.getUserById(req.cookies['SessionID'], function (err, result) {
        if (result) { // logged in
            if (result.access > 0) { // access type : administrators
                res.render('home/admin');
            } else {    // access type: general user.
                res.render('home/general');
            }
        } else { // not logged in
            res.render('home/default');
        }
    });
});

/* GET navbar page. */
router.get('/navbar', function (req, res, next) {
    database.getUserById(req.cookies['SessionID'], function (err, result) {
        if (result) { // logged in
            if (result.access > 0) { // access type : administrators
                res.render('navbar/admin');
            } else {    // access type: general user.
                res.render('navbar/general');
            }
        } else { // not logged in
            res.render('navbar/default');
        }
    });
});

module.exports = router;
