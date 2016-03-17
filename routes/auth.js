var debug = require('debug')('VaccineForChild:auth');
var express = require('express');
var mailer = require('../utility/mailer');
var session = require('../utility/session');
var database = require('../utility/database');

var router = express.Router();

var REMEMBER_PERIOD = 30 * 24 * 3600 * 1000; // 30 days
var DEFAULT_REMEMBER_PERIOD = 24 * 3600 * 1000; // 24 hours

/* POST logout request. */
router.get('/logout', function (req, res, next) {
    var key = req.cookies[session.SESSION_ID_COOKIE];
    res.clearCookie(session.SESSION_ID_COOKIE, null);
    session.removeSession(key);
    res.redirect('/');
});

function sendSessionId(res, user, remember) {
    // remove password for security
    delete user.password;
    // set age of session
    var age = remember ? REMEMBER_PERIOD : DEFAULT_REMEMBER_PERIOD;
    // create session
    var data = session.addSession(user);
    // add cookie
    res.cookie(session.SESSION_ID_COOKIE, data.key, {maxAge: age});
    // send OK
    res.status(200).end();
    // send confirm code
    if (!data.confirmed) {
        data.code = session.getConfirmCode();
        mailer.sendConfirmCode(data.email, data.code);
    }
}

/* POST login request. */
router.post('/login', function (req, res, next) {
    var user = req.body || {};
    database.getUserByName(user.uname, function (err, result) {
        if (err) {
            res.status(200).end(err);
        }
        else if (user.passwd !== result.password) {
            res.status(200).end("Password did not match");
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
            res.status(200).end(err);
        }
        else {
            sendSessionId(res, result);
        }
    });
});

/* POST change password */
router.post('/change-pass', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) {
        var user = req.body;
        database.changePassword(data.id, user.old, user.password, function (err, result) {
            if (err) {
                res.status(200).end(err);
            }
            else {
                res.sendStatus(200);
            }
        });
    }
});

/* POST confirm request. */
router.post('/confirm', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) {
        // get code from user
        var code = req.body.code;
        // check if this code matches the saved code
        if (data.code == code) {
            // set user as confirmed
            database.updateUser({
                    id: data.id,
                    confirmed: 1
                },
                function (err, result) {
                    if (err) { // connection failed
                        res.status(200).end(err);
                    } else {
                        debug(data.email + " confirmed by code = " + code);
                        res.status(200).end();
                        // update session data
                        data.confirmed = true;
                    }
                });
        } else {
            debug(data.code + " != " + code);
            res.status(200).end('The code is invalid');
        }
    }
});

/* POST confirm email. */
router.post('/mail-confirm', function (req, res, next) {
    var confirmCode = session.getConfirmCode();
    var data = session.getDataByRequest(req);
    if (data) {
        // mail the confirmation code
        mailer.sendConfirmCode(data.email, confirmCode, function (err, info) {
            if (err) { // could not send mail
                debug(err);
                res.status(200).end('Could not send Email');
            }
            else { // mail was sent
                debug(info);
                res.status(200).end();
                // store code in session
                data.code = confirmCode;
            }
        });
    }
});

module.exports = router;
