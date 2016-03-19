var debug = require('debug')('VaccineForChild:admin');
var express = require('express');
var session = require('../utility/session');
var database = require('../utility/database');
var property = require('../utility/property')();

var router = express.Router();

/* GET user. */
router.get('/add-vaccine', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) {
        var vac = res.body;
        database.createVaccine(vac.title, function (err, result) {
            res.status(200).send(err);
        });
    } else {
        res.status(401).end();
    }
});

module.exports = router;