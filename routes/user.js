var debug = require('debug')('VaccineForChild:auth');
var express = require('express');
var mailer = require('../utility/mailer');
var session = require('../utility/session');
var database = require('../utility/database');

var router = express.Router();

/* POST change password */
router.post('/update-user', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) {
        var user = req.body;
        // set id
        user.id = data.id;
        // check if email changed
        if (user.email != data.email) user.confirmed = 0;
        else user.email = null;
        // check if name changed
        if (user.name == data.name) user.name = null;
        // check if address changed
        if (user.address == data.address) user.address = null;
        // request database to update user
        database.updateUser(user, function (err, result) {
            if (err) { // error in database
                debug(err);
                res.status(200).end(err);
            }
            else { // data received successfully
                res.status(200).end();
                // send confirm code if not confirmed
                if (!result.confirmed) {
                    data.code = session.getConfirmCode();
                    mailer.sendConfirmCode(data.email, data.code, function (err, info) {
                        debug(err);
                        debug(info);
                    });
                }
                // update session
                debug(result);
                data.name = result.name;
                data.confirmed = result.confirmed;
                data.email = result.email;
            }
        });
    }
});

/* POST add new child */
router.post('/add-child', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) {
        var user = req.body;
        // create child in the database
        database.createChild(user.dob, data.id, user.name, user.height, user.weight, function (err, result) {
            if (err) { // database returned error
                debug(err);
                res.status(200).end(err);
            }
            else { // database is success
                res.status(200).end();
                // update in session
                debug(result);
                data.children[result.id] = result;
            }
        });
    }
});

module.exports = router;