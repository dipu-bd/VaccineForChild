var debug = require('debug')('VaccineForChild:forms');
var url = require('url');
var express = require('express');
var session = require('../resource/session');
var database = require('../resource/database');
var property = require('../resource/property')();

var router = express.Router();

/* GET a form. */
router.get('/login', function (req, res, next) {
    var id = req.cookies['SessionID'];
    if (!session.getSession(id)) {
        res.render('forms/login', property);
    } else {
        res.render('forms/invalid', property);
    }
});


module.exports = router;
