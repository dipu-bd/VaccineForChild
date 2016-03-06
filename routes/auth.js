var debug = require('debug')('VaccineForChild:auth');
var express = require('express');
var mailer = require('../resource/mailer');
var session = require('../resource/session');
var database = require('../resource/database');

var router = express.Router();

var REMEMBER_PERIOD = 30 * 24 * 3600 * 1000; // 30 days
var DEFAULT_REMEMBER_PERIOD = 30 * 60 * 1000; // 30 seconds

function mailConfirmCode(res) {
    var confirmCode = Math.floor((Math.random() * 10000) + 1);
    mailer.sendConfirmCode(data.email, confirmCode, function (err, info) {
        if (err) {
            debug(err);
            res.send(JSON.stringify({
                error: 'Could not send mail'
            }));
        }
        else {
            debug(info.message);
            res.send(JSON.stringify({
                code: confirmCode
            }));
        }
    });
}

/* POST logout request. */
router.get('/logout', function (req, res, next) {
    var id = req.cookies['SessionID'];
    res.clearCookie('SessionID', null);
    session.removeSession(id);
    res.redirect('/');
});

/* POST login request. */
router.post('/login', function (req, res, next) {
    var user = req.body || {};
    database.getUserByName(user.uname, function (err, result) {
        if (err) {
            res.send(err);
        }
        else if (user.passwd !== result.password) {
            res.send("Password did not match");
        }
        else {
            // remove password for security
            delete result.password;
            // set age of session
            var age = user.remember ? REMEMBER_PERIOD : DEFAULT_REMEMBER_PERIOD;
            // create session
            var id = session.addSession(result, age);
            // add cookie
            res.cookie('SessionID', id, {maxAge: age});
            // send OK
            res.sendStatus(200);
        }
    });
});

/* POST register request. */
router.post('/register', function (req, res, next) {
    var user = req.body || {};
    database.createUser(user.uname, user.email, user.password, function (err, result) {
        if (err) {
            res.send(JSON.stringify({
                error: err
            }));
        }
        else {
            // remove password for security
            delete result.password;
            // set age of session
            var age = user.remember ? REMEMBER_PERIOD : DEFAULT_REMEMBER_PERIOD;
            // create session
            var id = session.addSession(result, age);
            // add cookie
            res.cookie('SessionID', id, {maxAge: age});
            // send OK
            res.redirect('/');
        }
    });
});

/* Change password */
router.post('/change-pass', function (req, res, next) {
    var user = req.body;
    database.changePassword(user.id, user.old, user.password, function (err, result) {
        if (err) {
            res.send(JSON.stringify({
                error: err
            }));
        }
        else {
            res.sendStatus(200);
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
                res.sendStatus(200);
            }
        });
    }
    else {
        mailConfirmCode(res);
    }
});

module.exports = router;
