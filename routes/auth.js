var debug = require('debug')('VaccineForChild:auth');
var express = require('express');
var mailer = require('../resource/mailer');
var session = require('../resource/session');
var database = require('../resource/database');

var router = express.Router();

var SESSION_ID_COOKIE = 'SessionID';
var REMEMBER_PERIOD = 30 * 24 * 3600 * 1000; // 30 days
var DEFAULT_REMEMBER_PERIOD = 30 * 60 * 1000; // 30 seconds

/* POST logout request. */
router.get('/logout', function (req, res, next) {
    var key = req.cookies[SESSION_ID_COOKIE];
    res.clearCookie(SESSION_ID_COOKIE, null);
    session.removeSession(key);
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
            sendSessionId(res, result, user.remember);
        }
    });
});

/* POST register request. */
router.post('/register', function (req, res, next) {
    var user = req.body || {};
    database.createUser(user.uname, user.email, user.password, function (err, result) {
        if (err) {
            res.send(err);
        }
        else {
            sendSessionId(res, result, user.remember);
        }
    });
});

function sendSessionId(res, data, remember) {
    // remove password for security
    delete data.password;
    // set age of session
    var age = remember ? REMEMBER_PERIOD : DEFAULT_REMEMBER_PERIOD;
    // create session
    var id = session.addSession(data);
    // add cookie
    res.cookie(SESSION_ID_COOKIE, id, {maxAge: age});
    // send OK
    res.sendStatus(200);
}

/* POST change password */
router.post('/change-pass', function (req, res, next) {
    var user = req.body;
    var key = req.cookies[SESSION_ID_COOKIE];
    if (session.getSession(key)) {
        var data = session.getSession(key);
        database.changePassword(data.id, user.old, user.password, function (err, result) {
            if (err) {
                res.send(err);
            }
            else {
                res.sendStatus(200);
            }
        });
    }
});

/* POST confirm request. */
router.post('/confirm', function (req, res, next) {
    var data = req.body;
    var key = req.cookies[SESSION_ID_COOKIE];
    if (session.getSession(key)) {
        database.confirmEmail(data.email, function (err, result) {
            if (err) {
                res.status(503).send("Error connecting database");
            } else {
                res.status(204);
            }
        });
    }
});

/* POST confirm email. */
router.post('/mail-confirm', function (req, res, next) {
    // generate confirm code : 5 digits
    var confirmCode = Math.floor((Math.random() * 899999) + 100000);
    var key = req.cookies[SESSION_ID_COOKIE];
    if (session.getSession(key)) {
        // mail code
        mailer.sendConfirmCode(data.email, confirmCode, function (err, info) {
            if (err) {
                debug(err);
                res.send('Could not send an email');
            }
            else {
                debug(info);
                res.send(confirmCode);
            }
        });
    }
});

module.exports = router;
