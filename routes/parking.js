const express = require('express');
const router = express.Router();
const passport = require('passport');

const ParkingSpace = require('../models/parkingSpace');
const Device = require('../models/device');

/**
 * Creates new parking space
 */
router.post('/', async (req, res) => {
    let space = await new ParkingSpace({
        available: true,
        device: ''
    })
        .save()
        .catch((err) => {
            res.json({
                result: 'error'
            })
        });

        return res.json({
            result: 'success',
            parkingSpace: space
        })
});


/**
 * Returns all spaces
  */
router.get("/", async (req, res) => {
    const spaces = await ParkingSpace.find({});

    return res.json({
        spaces: spaces
    });
});


/**
 * Returns all free spaces
 */
router.get("/free", async (req, res) => {
    const spaces = await ParkingSpace.find({available: true});
        return res.json({
            spaces: spaces
        });
});


/**
 * Returns free parking spaces near longitude and latitude within distance
 */
router.post("/free", (req, res) => {
    let distance = req.body.distance;
    if (!distance) distance = 5000;
    const query = ParkingSpace.find({}).populate('device');
    query.where('device.location').near({
        center: {coordinates: [parseFloat(req.body.lat), parseFloat(req.body.long)], type: 'Point'},
        maxDistance: parseInt(distance)
    });
    //query.and([{available: true}]);
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
router.get("/taken", async (req, res) => {
    const spaces = await ParkingSpace.find({available: false});

    return res.json({
        spaces: spaces
    });
});


module.exports = router;
