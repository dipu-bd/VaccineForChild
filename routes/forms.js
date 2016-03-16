var debug = require('debug')('VaccineForChild:forms');
var url = require('url');
var express = require('express');
var session = require('../utility/session');
var property = require('../utility/property')();

var SESSION_ID_COOKIE = 'SessionID';

var router = express.Router();

/* GET loginform. */
router.get('/login', function (req, res, next) {
    var id = req.cookies[SESSION_ID_COOKIE];
    if (!session.getSession(id)) {
        res.render('forms/login', property);
    } else {
        res.render('invalid', property);
    }
});

/* GET register form. */
router.get('/register', function (req, res, next) {
    var id = req.cookies[SESSION_ID_COOKIE];
    if (!session.getSession(id)) {
        res.render('forms/register', property);
    } else {
        res.render('invalid', property);
    }
});
/* GET confirm form. */
router.get('/confirm', function (req, res, next) {
    var id = req.cookies[SESSION_ID_COOKIE];
    var result = session.getSession(id);
    if (result) {
        property.user = result.data;
        res.render('forms/confirm', property);
    } else {
        res.render('invalid', property);
    }
});
/* GET change-pass form. */
router.get('/change-pass', function (req, res, next) {
    var id = req.cookies[SESSION_ID_COOKIE];
    var result = session.getSession(id);
    if (result) {
        property.user = result.data;
        res.render('forms/change-pass', property);
    } else {
        res.render('invalid', property);
    }
});
/* GET change-pass form. */
router.get('/add-child', function (req, res, next) {
    var id = req.cookies[SESSION_ID_COOKIE];
    var result = session.getSession(id);
    if (result) {
        property.user = result.data;
        res.render('forms/add-child', property);
    } else {
        res.render('invalid', property);
    }
});

module.exports = router;
