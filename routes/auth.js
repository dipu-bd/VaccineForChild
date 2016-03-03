var express = require('express');
var database = require('../database');
var mailer = require('../resource/mailer');
var debug = require('debug')('VaccineForChild:auth');

var router = express.Router();

// Property table as resource
var resource = require('../resource/property')();

/* POST logout request. */
router.get('/logout', function (req, res, next) {
    res.clearCookie('SessionID', null);
    res.redirect('/');
});

/* POST login request. */
router.post('/login', function (req, res, next) {
    var user = req.body;
    database.getUserByName(user.uname, function (err, result) {
        if (err) {
            res.send(JSON.stringify({
                error: err
            }));
        }
        else if (user.passwd !== result.password) {
            res.send(JSON.stringify({
                error: "Password did not match"
            }));
        }
        else {
            var data = {};
            if (user.remember) data.maxAge = 30 * 24 * 3600;
            res.cookie('SessionID', result.id, data);
            res.send(200);
        }
    });
});

/* POST register request. */
router.post('/register', function (req, res, next) {
    var user = req.body;
    database.createUser(user.uname, user.email, user.password, function (err, result) {
        if (err) {
            res.send(JSON.stringify({
                error: err
            }));
        }
        else {
            res.cookie('SessionID', result.id, null);
            res.send(200);
        }
    });
});

/* POST confirm email. */
router.post('/confirm', function (req, res, next) {
    var data = req.body;
    if (data.confirmed) {
        database.confirmEmail(data.email, function (err, result) {
            if (err) {
                res.send(JSON.stringify({
                    error: "Error connecting database"
                }));
            } else {
                res.send(200);
            }
        });
    }
    else {
        var scode = Math.floor((Math.random() * 10000) + 1);
        mailer.sendConfirmCode(data.email, scode, function (err, info) {
            if (err) {
                debug(err);
                res.send(JSON.stringify({
                    error: 'Could not send mail'
                }));
            }
            else {
                debug(info.message);
                res.send(JSON.stringify({
                    error: null,
                    code: scode
                }));
            }
        })
    }
});

module.exports = router;
