const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv").config();

const User = require('../models/user');


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
router.get("/favorite", passport.authenticate('jwt', {session: false}), async (req, res) => {
    const user = await User.findById(req.user._id).populate('favorites');

    return res.json({
        favorites: user.favorites
    })
});

/**
 * Add favorite parking space
 */
router.post("/favorite", passport.authenticate('jwt', {session: false}), async (req, res) => {
    const user = await User.findOneAndUpdate(
        {_id: req.user._id},
        {$addToSet: {favorites: req.body.parkingSpace}},
        {new: true}
    )
        .populate('favorites')
        .catch((err) => {
            return res.json({
                result: 'error'
            })
        });
    return res.json({
        result: 'success',
        favorites: user.favorites
    });
});


/**
 * Remove favorite parking space
 */
router.delete("/favorite", passport.authenticate('jwt', {session: false}), async (req, res) => {
    const user = await User.findOneAndUpdate(
        {_id: req.user._id},
        {$pull: {favorites: req.body.parkingSpace}},
        {new: true}
    )
        .populate('favorites')
        .catch((err) => {
            return res.json({
                result: 'error'
            })
        });
    return res.json({
        result: 'success',
        favorites: user.favorites
    })
});

module.exports = router;
