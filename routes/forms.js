var debug = require('debug')('VaccineForChild:forms');
var url = require('url');
var express = require('express');
var session = require('../resource/session');
var property = require('../resource/property')();

var SESSION_ID_COOKIE = 'SessionID';

var router = express.Router();

/* GET loginform. */
router.get('/login', function (req, res, next) {
    var id = req.cookies[SESSION_ID_COOKIE];
    if (!session.getSession(id)) {
        res.render('forms/login', property);
    } else {
        res.render('forms/invalid', property);
    }
});

/* GET register form. */
router.get('/register', function (req, res, next) {
    var id = req.cookies[SESSION_ID_COOKIE];
    if (!session.getSession(id)) {
        res.render('forms/register', property);
    } else {
        res.render('forms/invalid', property);
    }
});
/* GET confirm form. */
router.get('/confirm', function (req, res, next) {
    var id = req.cookies[SESSION_ID_COOKIE];
    if (session.getSession(id)) {
        property.user = session.getSession(id);
        res.render('forms/confirm', property);
    } else {
        res.render('forms/invalid', property);
    }
});
/* GET change-pass form. */
router.get('/change-pass', function (req, res, next) {
    var id = req.cookies[SESSION_ID_COOKIE];
    if (session.getSession(id)) {
        property.user = session.getSession(id);
        res.render('forms/change-pass', property);
    } else {
        res.render('forms/invalid', property);
    }
});

module.exports = router;
