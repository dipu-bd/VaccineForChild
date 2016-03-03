var express = require('express');
var database = require('./../database');

var router = express.Router();

// Property table as resource
var resource = require('../resource/property')();

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log("Hello from home!");
    checkLogIn(req, function (result) {
        if (result) { // logged in
            resource.user = result;
            if (result.access > 0) { // access type : administrators
                res.render('home-admin', resource);
            } else {    // access type: general user.
                res.render('home-general', resource);
            }
        } else { // not logged in
            resource.user = null;
            res.render('home-default', resource);
        }
    });
});

/**
 * Check if user is logged on. If so, returns the user information.
 * @param req Request information.
 * @param callback (result) => Method to callback after check is done.
 */
function checkLogIn(req, callback) {
    var sessionID = req.cookies['SessionID'];
    database.getUser(sessionID, function (err, res) {
        callback(res);
    });
}

module.exports = router;
