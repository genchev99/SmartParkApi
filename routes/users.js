var express = require('express');
var router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();

const User = require('../models/user');
const ParkingSpace = require('../models/parkingSpace');


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/signup', passport.authenticate('signup', {session: false}), async (req, res, next) => {
    res.json({
        message: 'Signup successful',
        user: req.user
    });
});

router.post('/login', async (req, res, next) => {
    passport.authenticate('login', async (err, user, info) => {
        try {
            if (err || !user) {
                const error = new Error('An Error occured')
                return next(error);
            }
            req.login(user, {session: false}, async (error) => {
                if (error) return next(error);
                const body = {_id: user._id, email: user.email};
                const token = jwt.sign({user: body}, process.env.SECRET);
                return res.json({token});
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
});


/**
 * Get favorite parking spaces
 */
router.get("/favorite", passport.authenticate('jwt', {session: false}), (req, res) => {
    User.findById(req.user._id).populate('favorites').exec((err, user) => {
        if (err) return err;

        return res.json({
            favorites: user.favorites
        })
    });
});

/**
 * Add favorite parking space
 * @TODO: Remove the callbacks
 */
router.post("/favorite", passport.authenticate('jwt', {session: false}), (req, res) => {
    ParkingSpace.findById(req.body.parkingSpace, (err, parkingSpace) => {
        if (!parkingSpace) return res.status(400).json({error: 'No parking space chosen'});
        User.findById(req.user._id, (err, user) => {
            if (err) return err;
            user.favorites.push(parkingSpace._id);
            user.save(err => {
                if (err) return err;
                return res.json({
                    result: 'success',
                    favorites: user.favorites
                })
            });
        });
    });
});

/**
 * Remove favorite parking space
 */
router.delete("/favorite", passport.authenticate('jwt', {session: false}), (req, res) => {
        User.findById(req.user._id, (err, user) => {
            if (err) return err;
            user.favorites.pull(req.body.parkingSpace);
            user.save(err => {
                if (err) return err;
                return res.json({
                    result: 'success',
                    favorites: user.favorites
                })
            });
        });
});

module.exports = router;
