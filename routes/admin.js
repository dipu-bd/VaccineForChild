var debug = require('debug')('VaccineForChild:admin');
var express = require('express');
var session = require('../utility/session');
var database = require('../utility/database');

var router = express.Router();

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
    console.log(req.body);
    database.getDosesOfVaccine(req.body.id, function (err, result) {
        if (err)
            res.status(500).send(err);
        else
            res.status(200).send(result);
    });
});

/* POST add vaccine. */
router.post('/add-vaccine', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data && data.access > 0) {
        var vac = res.body;
        database.createVaccine(vac.title, function (err, result) {
            res.status(200).send(err);
        });
    } else {
        res.status(401).end();
    }
});

/* POST edit vaccine. */
router.post('/edit-vaccine', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data && data.access > 0) {
        var vac = res.body;
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
        var vac = res.body;
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
        var dose = res.body;
        database.createDose(dose.vaccine, dose.name, dose.dab, function (err, result) {
            res.status(200).send(err);
        });
    } else {
        res.status(401).end();
    }
});


/* POST edit dose. */
router.post('/edit-dose', function (req, res, next) {
    var data = session.getDataByRequest(req);
    if (data && data.access > 0) {
        var dose = res.body;
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
        var dose = res.body;
        database.deleteDose(dose.id, function (err, result) {
            res.status(200).send(err);
        });
    } else {
        res.status(401).end();
    }
});

module.exports = router;