const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();

const User = require('../models/user');
const Favorite = require('../models/favorite');


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
                return res.status(400).json({
                    errors: {'global': 'Invalid Credentials'}
                })
            }
            req.login(user, {session: false}, async (error) => {
                if (error) return res.status(400).json({
                    errors: {'global': 'Invalid Credentials'}
                });
                const body = {_id: user._id, email: user.email};
                const token = jwt.sign({user: body}, process.env.SECRET);
                return res.json({
                    user: {
                        email: user.email,
                        token: token
                    }
                });
            });
        } catch (error) {
            return res.status(400).json({
                errors: {'global': 'Invalid Credentials'}
            });
        }
    })(req, res, next);
});


/**
 * Get favorite parking spaces
 */
router.get("/favorites", passport.authenticate('jwt', {session: false}), async (req, res) => {
    const favorites = await Favorite.find({user: req.user._id});

    return res.json({
        favorites: favorites
    })
});

/**
 * Add favorite parking space
 */
router.post("/favorites", passport.authenticate('jwt', {session: false}), async (req, res) => {
    const favorite = await Favorite.findOneAndUpdate({
        user: req.user._id,
        parkingSpace: req.body.parkingSpace,
        name: req.body.name
    }, {}, {
        upsert: true,
        new: true
    });

    return res.json(favorite);
});


/**
 * Remove favorite parking space
 */
router.delete("/favorites", passport.authenticate('jwt', {session: false}), async (req, res) => {
    const favorite = await Favorite.deleteOne({
        _id: req.body.id
    });

    return res.json({
        result: 'success',
    });
});

module.exports = router;
