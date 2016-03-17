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
    var data = session.getDataByRequest(req);
    if (data) { // logged in
        property.user = data;
        if (data.access) { // access type : administrators
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
    var data = session.getDataByRequest(req);
    if (data) { // logged in
        property.user = data;
        property.admin = data.access;
    } else { // not logged ni
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
    var data = session.getDataByRequest(req);
    if (data) { // logged in
        property.user = data;
        property.admin = data.access;
        res.render('profile', property);
    } else { // not logged in
        res.status(401).end();
    }
});

/* GET children page. */
router.get('/children', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (result) { // logged in
        property.user = data;
        property.admin = data.access;
        res.render('children', property);
    } else { // not logged in
        res.status(401).end();
    }
});

/* GET vaccine page. */
router.get('/vaccines', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) { // logged in as admin
        property.user = data;
        property.admin = data.access;
        res.render('vaccine', property);
    } else { // not logged in
        res.status(401).end();
    }
});

/* GET centers page. */
router.get('/users', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data && data.access) { // logged in as admin
        property.user = data;
        property.admin = data.access;
        res.render('users', property);
    } else { // not logged in as admin
        res.status(401).end();
    }
});

module.exports = router;
