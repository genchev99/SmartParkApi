const express = require('express');
const router = express.Router();
const parkingSpace = require('../models/parkingSpace');

router.post('/', (req, res) => {
    let space = new parkingSpace({
        available: true,
        location: {
            type: 'Point',
            coordinates: [42.645599, 23.331292]
        }
    });

    space.save(function (err) {
        if (err) {
            return console.log(err);
        }
        res.send('Created successfully')
    })
});

router.get("/", (req, res) => {
    /* Returns all spaces */
});

router.get("/free", (req, res) => {
    /* Returns free parking spaces near longitude and latitude */
    const query = parkingSpace.find();
    query.where('location').near({
        center: {coordinates: [parseFloat(req.body.lat), parseFloat(req.body.long)], type: 'Point'},
        maxDistance: 5000
    });
    query.and([{available: true}]);
    query.exec(function (err, spaces) {
        if (err) console.log(err);
        return res.json(spaces);
    })

});

router.get("/taken", () => {
    /* returns free data */
});

module.exports = router;
