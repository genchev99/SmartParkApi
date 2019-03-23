const express = require('express');
const router = express.Router();
const passport = require('passport');
const _ = require("lodash");

const ParkingSpace = require('../models/parkingSpace');
const Device = require('../models/device');

/**
 * Creates new parking space
 */
router.post('/', async (req, res) => {
    let space = await new ParkingSpace({
        available: true,
        device: '5c9634742d9679ed7dd00fac'
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
router.post("/free", async (req, res) => {
    let distance = req.body.distance;
    if (!distance || distance <= 0) distance = 5000000000000000;
    const query = ParkingSpace.find({}).populate('device');
    query.where('device.location').near({
        center: {coordinates: [parseFloat("41.679838"), parseFloat("23.310965")], type: 'Point'},
        maxDistance: parseInt(distance)
    });
    //query.and([{available: true}]);
    query.exec((err, spaces) => {
        if (err) console.log(err);
        return res.json({
            spaces: spaces
        });
    });

    /*const query = ParkingSpace.find(
        {
            "device.location": {
                "$near": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [ 2, 4 ]
                    }
                }
            }
        }
    );

    query.populate("device").exec(function(err,shapes) {
        if (err) throw err;
        console.log( shapes );
    });*/

    /*const devices = await ParkingSpace.find({}).populate('device').find({
        "device.location": {
            $near: {
                $maxDistance: 1000,
                $geometry: { type: 'Point', coordinates: [ 41.679838, 23.310965 ] }
            }
        }
    });
    _.forEach(devices, device => {
        console.log(device.device.location);
    });
    console.log(devices);*/

/*.find({
        "device.location": {
            $near: {
                $maxDistance: 1000,
                $geometry: {
                    type: "Point",
                    coordinates: [1, 1]
                }
            }
        }
    });*/
    /*_.forEach(devices, device => {

    })*/
    /*query.where('device.location').near({
        center: {coordinates: [parseFloat(req.body.lat), parseFloat(req.body.long)], type: 'Point'},
        maxDistance: parseInt(distance)
    });
    //query.and([{available: true}]);
    query.exec((err, spaces) => {
        if (err) console.log(err);
        return res.json({
            spaces: spaces
        });
    })*/

    // res.status(200).json({});
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
