var express = require('express');
var debug = require('debug')('VaccineForChild:server');

var router = express.Router();

// Property table as resource
var resource = require('../resource/property')();

/* GET login form. */
router.get('/login', function (req, res, next) {
    res.render('forms/login', resource);
});

/* GET register form. */
router.get('/register', function (req, res, next) {
    res.render('forms/register', resource);
});

/* GET confirm form. */
router.get('/confirm', function (req, res, next) {
    res.render('forms/confirm', resource);
});


module.exports = router;
