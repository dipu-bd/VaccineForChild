var debug = require('debug')('VaccineForChild:apis');
var express = require('express');
var session = require('../resource/session');
var property = require('../resource/property')();

var router = express.Router();

/* GET user. */
router.get('/user-data', function (req, res, next) {
    var id = req.cookies['SessionID'];
    var data = session.getSession(id) || {};
    data.property = property;
    res.send(JSON.stringify(data));
});


module.exports = router;
