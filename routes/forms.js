var debug = require('debug')('VaccineForChild:forms');
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
    if (data) { // if logged in
        property.user = data;
        res.render('forms/confirm', property);
    } else { // not logged in
        res.render('invalid');
    }
});

/* GET change-pass form. */
router.get('/change-pass', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) { // if logged in
        property.user = data;
        res.render('forms/change-pass', property);
    } else { // not logged in
        res.render('invalid');
    }
});

/* GET add-child form. */
router.get('/add-child', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) { // if logged in
        property.user = data;
        res.render('forms/add-child', property);
    } else { // not logged in
        res.render('invalid');
    }
});


/* GET add-vaccine form. */
router.get('/add-vaccine', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data && data.access > 0) { // if logged in as admin
        property.user = data;
        res.render('forms/add-vaccine', property);
    } else { // not logged in as admin
        res.render('invalid');
    }
});

/* GET add-dose form. */
router.get('/add-dose', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data && data.access > 0) { // if logged in as admin
        property.user = data;
        res.render('forms/add-dose', property);
    } else { // not logged in as admin
        res.render('invalid');
    }
});


/* GET add-phone form. */
router.get('/add-phone', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) { // if logged in
        property.user = data;
        res.render('forms/add-phone', property);
    } else { // not logged in
        res.render('invalid');
    }
});

module.exports = router;
