var debug = require('debug')('VaccineForChild:index');
var express = require('express');
var session = require('../utility/session');
var property = require('../utility/property')();
var database = require('../utility/database');

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
        if (data.access) { // access type : administrator.
            res.render('users', property);
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
        res.render('profile', property);
    } else { // not logged in
        res.render('invalid');
    }
});

/* GET children page. */
router.get('/children', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) { // logged in
        property.user = data;
        res.render('children', property);
    } else { // not logged in
        res.render('invalid');
    }
});

/* GET vaccine page. */
router.get('/vaccines', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) { // logged in
        property.user = data;
        res.render('vaccine', property);
    } else { // not logged in
        res.render('invalid');
    }
});

/* GET takens page. */
router.get('/takens', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) { // logged in
        database.getChildrenOf(data.id, function (err, result) {
            if (!err) {
                property.user = data;
                property.user.children = result;
                res.render('takens', property);
            }
        });
    } else { // not logged in
        res.render('invalid');
    }
});

/* GET centers page. */
router.get('/users', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data && data.access) { // logged in as admin
        property.user = data;
        res.render('users', property);
    } else { // not logged in as admin
        res.render('invalid');
    }
});

/* GET child page */
router.get('/child-page', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) {
        property.user = data;
        res.render('component/child', property);
    } else {
        res.render('invalid');
    }
});

/* GET child view page */
router.get('/view-child', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) {
        property.user = data;
        database.getChildrenOf(data.id, function (err, result) {
            if (err) {
                res.status(500).end(err);
            }
            else {
                property.children = result;
                res.render('view-child', property);
            }
        });
    } else {
        res.render('invalid');
    }
});

/* GET user data */
router.get('/user-data', function (req, res, next) {
    var data = session.getDataByRequest(req);
    res.status(200).send(data);
});

module.exports = router;
