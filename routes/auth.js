var debug = require('debug')('VaccineForChild:auth');
var express = require('express');
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
    // send confirm code
    if (!data.confirmed) {
        session.sendConfirmMail(data);
    }
    // send OK
    res.status(200).end();
}

/* POST login request. */
router.post('/login', function (req, res, next) {
    var user = req.body;
    database.getUserByName(user.uname, function (err, result) {
        if (err) {
            res.status(200).send(err);
        }
        else if (user.passwd !== result.password) {
            res.status(200).send("Password did not match");
        }
        else {
            sendSessionId(res, result, user.remember);
        }
    });
});

/* POST register request. */
router.post('/register', function (req, res, next) {
    var user = req.body;
    database.createUser(user.uname, user.email, user.password, user.name, function (err, result) {
        if (err) {
            res.status(200).send(err);
        }
        else {
            sendSessionId(res, result);
        }
    });
});

/* POST change password */
router.post('/change-pass', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) { // if logged in
        var user = req.body;
        database.changePassword(data.id, user.old, user.password, function (err, result) {
            res.status(200).send(err);
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
                        res.status(200).send(err);
                    } else {
                        debug(data.email + " confirmed by code = " + code);
                        res.status(200).end();
                        // update session data
                        data.confirmed = true;
                    }
                });
        } else {
            debug(data.code + " != " + code);
            res.status(200).send('The code is invalid');
        }
    }
});

/* POST confirm email. */
router.post('/mail-confirm', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) {
        // mail the confirmation code
        session.sendConfirmMail(data, function (err) {
            res.status(200).send(err);
        });
    } else {
        res.status(401).end();
    }
});

module.exports = router;
