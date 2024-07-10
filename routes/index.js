var express = require('express');
const cronJob = require('../models/cronJob');
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {
    const cronJobs = await cronJob
      .find()
      .sort({ updatedAt: -1 })
    res.render('layout', { title: 'SMART Launch App', cronJob: cronJobs });

  } catch (err) {
    console.log("router.get ~ err:", err)
  }
});

module.exports = router;
