var debug = require('debug')('VaccineForChild:admin');
var express = require('express');
var session = require('../utility/session');
var database = require('../utility/database');

var router = express.Router();

/* GET list of all users */
router.get('/users', function (req, res, next) {
    database.getAllUsers(function (err, result) {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send(result);
    });
});


/* GET list of all vaccines */
router.get('/vaccines', function (req, res, next) {
    database.getAllVaccines(function (err, result) {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send(result);
    });
});

/* GET list of all doses */
router.get('/doses', function (req, res, next) {
    database.getAllDoses(function (err, result) {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send(result);
    });
});

/* GET list of doses of a certain vaccine */
router.get('/doses-of', function (req, res, next) {
    database.getDosesOfVaccine(req.query.id, function (err, result) {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send(result);
    });
});

/* GET number of children of a certain vaccine */
router.get('/children-count', function (req, res, next) {
    database.getChildrenOf(req.query.id, function (err, result) {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).end(result.length.toString());
    });
});

/* POST make user admin */
router.post('/make-admin', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data && data.access > 0) {
        var user = {id: req.body.id, access: 1};
        database.updateUser(user, function (err, result) {
            res.status(200).end(err);
        });
    } else {
        res.status(401).end();
    }
});

/* POST delete user. */
router.post('/delete-user', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data && data.access > 0) {
        database.deleteUser(req.body.id, function (err, result) {
            res.status(200).end(err);
        });
    } else {
        res.status(401).end();
    }
});

/* POST add vaccine. */
router.post('/add-vaccine', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data && data.access > 0) {
        var vac = req.body;
        database.createVaccine(vac.title, function (err, result) {
            res.status(200).send(err);
        });
    } else {
        res.status(401).end();
    }
});

/* POST edit vaccine. */
router.post('/update-vaccine', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data && data.access > 0) {
        var vac = req.body;
        database.updateVaccine(vac, function (err, result) {
            res.status(200).send(err);
        });
    } else {
        res.status(401).end();
    }
});

/* POST delete vaccine. */
router.post('/delete-vaccine', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data && data.access > 0) {
        var vac = req.body;
        database.deleteVaccine(vac.id, function (err, result) {
            res.status(200).send(err);
        });
    } else {
        res.status(401).end();
    }
});

/* POST add dose. */
router.post('/add-dose', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data && data.access > 0) {
        var dose = req.body;
        dose.dab = (dose.dab || 0) * (24 * 3600 * 1000);
        dose.period = (dose.period || 1) * (24 * 3600 * 1000);
        database.createDose(dose.vaccine, dose.name, dose.dab, dose.period, function (err, result) {
            res.status(200).send(err);
        });
    } else {
        res.status(401).end();
    }
});


/* POST edit dose. */
router.post('/update-dose', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data && data.access > 0) {
        var dose = req.body;
        dose.dab = (dose.dab || 0) * (24 * 3600 * 1000);
        dose.period = (dose.period || 1) * (24 * 3600 * 1000);
        database.updateDose(dose, function (err, result) {
            res.status(200).send(err);
        });
    } else {
        res.status(401).end();
    }
});


/* POST delete dose. */
router.post('/delete-dose', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data && data.access > 0) {
        var dose = req.body;
        database.deleteDose(dose.id, function (err, result) {
            res.status(200).send(err);
        });
    } else {
        res.status(401).end();
    }
});

module.exports = router;