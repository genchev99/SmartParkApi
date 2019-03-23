const express = require('express');
const router = express.Router();
const ParkingSpace = require('../models/parkingSpace');
const passport = require('passport');

/**
 * Creates new parking space
 */
router.post('/', (req, res) => {
    let space = new ParkingSpace({
        available: true,
        location: {
            type: 'Point',
            coordinates: [42.710397, 23.321969]
        }
    });

    space.save(err => {
        if (err) return err;
        return res.send('Created successfully')
    })
});


/**
 * Returns all spaces
  */
router.get("/", (req, res) => {
    ParkingSpace.find({}, (err, spaces) => {
        if (err) return err;
        return res.json({
            spaces: spaces
        });
    })
});


/**
 * Returns all free spaces
 */
router.get("/free", (req, res) => {
    ParkingSpace.find({available: true}, (err, spaces) => {
        if (err) return err;
        return res.json({
            spaces: spaces
        });
    })
});


/**
 * Returns free parking spaces near longitude and latitude within distance
 */
router.post("/free", (req, res) => {
    let distance = req.body.distance;
    if (!distance) distance = 5000;
    const query = ParkingSpace.find();
    query.where('location').near({
        center: {coordinates: [parseFloat(req.body.lat), parseFloat(req.body.long)], type: 'Point'},
        maxDistance: distance
    });
    query.and([{available: true}]);
    query.exec((err, spaces) => {
        if (err) console.log(err);
        return res.json({
            spaces: spaces
        });
    })

});


/**
 * Return taken parking spaces
 */
router.get("/taken", (req, res) => {
    ParkingSpace.find({available: false}, (err, spaces) => {
        if (err) return err;
        return res.json({
            spaces: spaces
        });
    })
});


module.exports = router;
