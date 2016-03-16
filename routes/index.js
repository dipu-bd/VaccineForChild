var debug = require('debug')('VaccineForChild:index');
var express = require('express');
var session = require('../utility/session');
var property = require('../utility/property')();

var router = express.Router();

/* GET index page. */
router.get('/', function (req, res, next) {
    res.render('index', property);
});

/* GET home page. */
router.get('/home-page', function (req, res, next) {
    var id = req.cookies['SessionID'];
    var result = session.getSession(id);
    if (result) { // logged in
        property.user = result.data;
        if (result.access > 0) { // access type : administrators
            res.render('home/admin', property);
        } else {    // access type: general user.
            res.render('home/general', property);
        }
    } else { // not logged in
        property.user = null;
        res.render('home/default', property);
    }
});

/* GET navigation bar. */
router.get('/nav-bar', function (req, res, next) {
    var id = req.cookies['SessionID'];
    var result = session.getSession(id);
    if (result) { // logged in
        property.user = result.data;
        property.admin = (result.data.access > 0);
    } else { // not logged in
        property.user = null;
    }
    res.render('component/nav-bar', property);
});

/* GET bottom bar. */
router.get('/bottom-bar', function (req, res, next) {
    res.render('component/bottom-bar', property);
});

/* GET profile page. */
router.get('/profile', function (req, res, next) {
    var id = req.cookies['SessionID'];
    var result = session.getSession(id);
    if (result) { // logged in
        property.user = result.data;
        property.admin = (result.data.access > 0);
        res.render('profile', property);
    } else { // not logged in
        property.user = null;
        res.render('invalid', property);
    }
});

/* GET children page. */
router.get('/children', function (req, res, next) {
    var id = req.cookies['SessionID'];
    var result = session.getSession(id);
    if (result) { // logged in
        property.user = result.data;
        property.admin = (result.data.access > 0);
        res.render('children', property);
    } else { // not logged in
        property.user = null;
        res.render('invalid', property);
    }
});

/* GET vaccine page. */
router.get('/vaccines', function (req, res, next) {
    var id = req.cookies['SessionID'];
    var result = session.getSession(id);
    if (result) { // logged in as admin
        property.user = result.data;
        property.admin = (result.data.access > 0);
        res.render('forms/add-child', property);
    } else { // not logged in
        property.user = null;
        res.render('invalid', property);
    }
});

/* GET centers page. */
router.get('/users', function (req, res, next) {
    var id = req.cookies['SessionID'];
    var result = session.getSession(id);
    if (result && result.data.access > 0) { // logged in as admin
        property.user = result.data;
        property.admin = (result.data.access > 0);
        res.render('users', property);
    } else { // not logged in as admin
        property.user = null;
        res.render('invalid', property);
    }
});

module.exports = router;
