var debug = require('debug')('VaccineForChild:forms');
var url = require('url');
var express = require('express');
var session = require('../utility/session');
var property = require('../utility/property')();

var router = express.Router();

/* GET login form. */
router.get('/login', function (req, res, next) {
    res.render('forms/login', property);
});

/* GET register form. */
router.get('/register', function (req, res, next) {
    res.render('forms/register', property);
});

/* GET confirm form. */
router.get('/confirm', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) {
        property.user = data;
        res.render('forms/confirm', property);
    } else {
        property.user = null;
        res.render('invalid', property);
    }
});

/* GET change-pass form. */
router.get('/change-pass', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) {
        property.user = data;
        res.render('forms/change-pass', property);
    } else {
        property.user = null;
        res.render('invalid', property);
    }
});

/* GET add-child form. */
router.get('/add-child', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) {
        property.user = data;
        res.render('forms/add-child', property);
    } else {
        property.user = null;
        res.render('invalid', property);
    }
});


module.exports = router;
