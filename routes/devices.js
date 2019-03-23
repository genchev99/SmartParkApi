const express = require('express');
const router = express.Router();
const Device = require("../models/device");

const getDevices = options => {
    return new Promise(async (resolve, reject) => {
        const devices = await Device
            .find(options)
            .sort({updatedAt: -1})
            .catch(e => reject(e));

        return resolve(devices);
    });
};

router.get("/", async (req, res) => {
    /* Returns all devices */
    const devices = await getDevices({});
    res.status(200).json({
        devices: devices
    });
});


router.post('/', async (req, res) => {
    const device = await Device.findOneAndUpdate({
        active: true,
        lastCharged: new Date()
    }, {}, {
        upsert: true,
        new: true
    });

    return res.json(device);
});

router.get("/active", async (req, res) => {
    /* Returns active devices */
    const devices = await getDevices({active: true});
    res.status(200).json({
        devices: devices
    });
});

router.get("/inactive", async (req, res) => {
    /* Returns inactive devices */
    const devices = await getDevices({active: false});
    res.status(200).json({
        devices: devices
    });
});

module.exports = router;
