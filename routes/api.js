var debug = require('debug')('VaccineForChild:apis');
var express = require('express');
var session = require('../utility/session');
var property = require('../utility/property')();

var router = express.Router();

/* GET user. */
router.get('/user-data', function (req, res, next) {
    var id = req.cookies[session.SESSION_ID_COOKIE];
    var data = session.getSession(id) || {};
    data.property = property;
    res.send(JSON.stringify(data));
});

/* GET list of all children */
router.get('/get-children', function (req, res, next) {
    var id = req.cookies['SessionID'];
    var sdat = session.getSession(id);
    if (sdat) {
        database.getAllChilds(sdat.data.id, function (err, result) {
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
