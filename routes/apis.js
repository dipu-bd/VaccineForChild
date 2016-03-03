var express = require('express');
var database = require('./../database');

var router = express.Router();

// Property table as resource
var resource = require('../resource/property')();

/* GET home page. */
router.get('/property', function (req, res, next) {
    console.log('Here in api property!');
    res.send(JSON.stringify(resource));
});


module.exports = router;
