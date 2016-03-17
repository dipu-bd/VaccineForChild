var debug = require('debug')('VaccineForChild:auth');
var express = require('express');
var mailer = require('../utility/mailer');
var session = require('../utility/session');
var database = require('../utility/database');

var router = express.Router();

/* POST change password */
router.post('/update-user', function (req, res, next) {
    var key = req.cookies[session.SESSION_ID_COOKIE];
    var data = session.getSession(key);
    if (data) {
        var user = req.body;
        user.id = data.data.id;
        if (user.email != data.data.email) user.confirmed = 0;
        else user.email = null;
        if (user.name == data.data.name) user.name = null;
        if (user.address == data.data.address) user.address = null;
        database.updateUser(user, function (err, result) {
            if (err) {
                res.send(err);
            }
            else {
                data.data = result;
                res.sendStatus(200);
                if (!user.confirmed) {
                    mailer.sendConfirmCode(sdat.data.email, session.getConfirmCode());
                }
            }
        });
    }
});

/* POST add new child */
router.post('/add-child', function (req, res, next) {
    var key = req.cookies[session.SESSION_ID_COOKIE];
    var sdat = session.getSession(key);
    if (sdat) {
        var user = req.body;
        user.dob = new Date(user.year, user.month, user.day);
        database.createChild(user.dob, sdat.data.id, user.name, user.height, user.weight, function (err, result) {
            if (err) {
                res.send(err);
            }
            else {
                sdat.data = result;
                res.sendStatus(200);
            }
        });
    }
});


module.exports = router;