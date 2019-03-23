const express = require('express');
const router = express.Router();

router.post("/", (req, res) => {
  res.status(200).end();
});

router.get("/", (req, res) => {
  /* Returns all beacons */
  res.status(200).end();
});

module.exports = router;