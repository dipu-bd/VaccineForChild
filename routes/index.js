var express = require('express');
var database = require('../database');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    checkRequest(req, function (logon) {
        if (logon)
            res.render('main-page', resource);
        else
            res.render('index', resource);
    });
});

function checkRequest(req, callback) {
    var sessionID = req.cookies['session'];
    database.getUser(sessionID, function (err, result) {
        callback(result);
    });
}

var resource = {
    title: 'Vaccine for Children'
};

module.exports = router;