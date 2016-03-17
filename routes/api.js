var debug = require('debug')('VaccineForChild:apis');
var express = require('express');
var session = require('../utility/session');
var property = require('../utility/property')();

var router = express.Router();

/* GET user. */
router.get('/user-data', function (req, res, next) {
    var data = session.getDataByRequest(req) || {};
    data.property = property;
    res.send(data);
});

/* GET list of all children */
router.get('/get-children', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) {
        if (data.children) {   // check if children already exists
            res.send(data.children);
        } else {
            // get children from database
            database.getChildren(data.id, function (err, result) {
                if (err) { // error in database
                    res.status(200).end(err);
                }
                else { // got children from database
                    res.status(200).end();
                    // save children in session
                    data.children = result;
                }
            });
        }
    }
});

router.post('/delete-child', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) {
        var child = req.body;
        // delete child from database
        database.deleteChild(child.id, function (err, result) {
            if (err) { // database returned error
                res.status(200).end(err);
            } else {
                res.status(200).end();
                //delete from session
                delete data.children[child.id];
            }
        });
    }
});

router.post('/update-child', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) {
        var child = req.body;
        // update child in database
        database.updateChild(child, function (err, result) {
            if (err) { // database returned error
                res.status(200).end(err);
            } else {
                res.status(200).end();
                //update in session
                data.children[child.id] = result;
            }
        })
    }
});

module.exports = router;
