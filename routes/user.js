var debug = require('debug')('VaccineForChild:auth');
var express = require('express');
var mailer = require('../utility/mailer');
var session = require('../utility/session');
var database = require('../utility/database');

var router = express.Router();

var SESSION_ID_COOKIE = 'SessionID';

/* POST change password */
router.post('/update-user', function (req, res, next) {
    var user = req.body;
    var key = req.cookies[SESSION_ID_COOKIE];
    var sdat = session.getSession(key);
    if (sdat) {
        user.id = sdat.data.id;
        if (user.email != sdat.data.email) user.confirmed = 0;
        else user.email = null;
        if (user.name == sdat.data.name) user.name = null;
        if (user.address == sdat.data.address) user.address = null;
        database.updateUser(user, function (err, result) {
            if (err) {
                res.send(err);
            }
            else {
                sdat.data = result;
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

});

/* GET list of all children */
router.get('/get-children', function (req, res, next) {

});

module.exports = router;