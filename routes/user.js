var debug = require('debug')('VaccineForChild:user');
var express = require('express');
var session = require('../utility/session');
var database = require('../utility/database');

var router = express.Router();

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
                    res.status(500).send(err);
                }
                else { // got children from database
                    // save children in session
                    data.children = result;
                    // send success message
                    res.status(200).send(result);
                }
            });
        }
    } else {
        res.status(401).end();
    }
});

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
        // request database to update user
        database.updateUser(user, function (err, result) {
            if (err) { // error in database
                debug(err);
                res.status(200).send(err);
            }
            else { // data received successfully
                // send confirm code if not confirmed
                if (!result.confirmed) {
                    session.sendConfirmMail(data);
                }
                // update session
                debug(result);
                Object.keys(result).forEach(function (key) {
                    data[key] = result[key];
                });
                // send success message
                res.status(200).end();
            }
        });
    } else {
        res.status(401).end();
    }
});

/* POST add new child */
router.post('/add-child', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) {
        var user = req.body;
        // calculate date of birth
        if (user.year && user.month && user.day) {
            user.dob = (new Date(user.year, user.month, user.day)).getTime();
        }
        // create child in the database
        database.createChild(data.id, user.name, user.dob, user.height, user.weight, user.gender,
            function (err, result) {
                if (err) { // database returned error
                    debug(err);
                    res.status(200).send(err);
                }
                else {
                    // update in session
                    debug(result);
                    data.children.push(result[0]);
                    // send success message
                    res.status(200).end();
                }
            });
    } else {
        res.status(401).end();
    }
});

router.post('/delete-child', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) {
        var child = req.body;
        // delete child from database
        database.deleteChild(child.id, function (err, result) {
            if (err) { // database returned error
                res.status(200).send(err);
            } else {
                //delete from session
                for (var i = 0; i < data.children.length; ++i) {
                    if (data.children[i].id == child.id) {
                        data.children.splice(i, 1);
                        break;
                    }
                }
                // send success message
                res.status(200).end();
            }
        });
    } else {
        res.status(401).end();
    }
});

router.post('/update-child', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data) {
        var child = req.body;
        // update child in database
        database.updateChild(child, function (err, result) {
            if (err) { // database returned error
                res.status(200).send(err);
            } else {
                res.status(200).end();
                //update in session
                for (var i = 0; i < data.children.length; ++i) {
                    if (data.children[i].id == child.id) {
                        data.children[i] = result[0];
                        break;
                    }
                }
            }
        });
    } else {
        res.status(401).end();
    }
});


module.exports = router;