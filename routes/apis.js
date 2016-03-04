var express = require('express');
var database = require('./../database');

var router = express.Router();

// Property table as resource
var resource = require('../resource/property')();

/* GET properties. */
router.get('/property', function (req, res, next) {
    res.send(JSON.stringify(resource));
});

/* GET user. */
router.get('/user', function (req, res, next) {
    var id = req.cookies['SessionID'];
    database.getUserById(id, function (err, result) {
        if (result == null)
            res.sendStatus(200);
        else {
            result.password = null;
            res.send(JSON.stringify(result));
        }
    });
});


module.exports = router;
