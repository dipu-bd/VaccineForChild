var debug = require('debug')('VaccineForChild:auth');
var express = require('express');
var mailer = require('../resource/mailer');
var session = require('../resource/session');
var database = require('../resource/database');

var router = express.Router();

var SESSION_ID_COOKIE = 'SessionID';
var REMEMBER_PERIOD = 30 * 24 * 3600 * 1000; // 30 days
var DEFAULT_REMEMBER_PERIOD = 30 * 3600 * 1000; // 30 seconds

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
            mailer.sendConfirmCode(user.email, getConfirmCode);
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
    var sdata = session.getSession(key);
    if (sdat) {
        database.changePassword(sdat.data.id, user.old, user.password, function (err, result) {
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
    var code = req.body.code;
    var key = req.cookies[SESSION_ID_COOKIE];
    var sdat = session.getSession(key);
    if (sdat) {
        if (sdat.confirmCode == code) {
            database.confirmEmail(sdat.data.email, function (err, result) {
                if (err) {
                    res.send("Error connecting to database");
                } else {
                    debug(sdat.data.email + " confirmed.");
                    sdat.data.confirmed = true;
                    res.sendStatus(200);
                }
            });
        } else {
            debug(sdat.confirmCode + " != " + code);
            res.send('The code is invalid.');
        }
    }
});

/* POST confirm email. */
router.post('/mail-confirm', function (req, res, next) {
    var confirmCode = getConfirmCode();
    var key = req.cookies[SESSION_ID_COOKIE];
    var sdat = session.getSession(key);
    if (sdat) {
        // mail code
        mailer.sendConfirmCode(sdat.data.email, confirmCode, function (err, info) {
            if (err) {
                debug(err);
                res.send('Could not send an Email.');
            }
            else {
                debug(info);
                res.sendStatus(200);
                sdat.confirmCode = confirmCode;
            }
        });
    }
});

function getConfirmCode() {
    // generate confirm code : 5 digits
    return Math.floor((Math.random() * 899999) + 100000);
}

module.exports = router;
