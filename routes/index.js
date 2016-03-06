var debug = require('debug')('VaccineForChild:index');
var express = require('express');
var session = require('../resource/session');
var property = require('../resource/property')();

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
        res.clearCookie('SessionID', null);
        res.render('home/default', property);
    }
});

/* GET navigation bar. */
router.get('/nav-bar', function (req, res, next) {
    var id = req.cookies['SessionID'];
    var result = session.getSession(id);
    if (result) { // logged in
        property.user = result.data;
        property.admin = (result.access > 0);
    } else { // not logged in
        property.user = null;
        res.clearCookie('SessionID', null);
    }
    res.render('component/nav-bar', property);
});

/* GET bottom bar. */
router.get('/bottom-bar', function (req, res, next) {
    res.render('component/bottom-bar', property);
});

module.exports = router;
