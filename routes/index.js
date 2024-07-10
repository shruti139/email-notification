var express = require('express');
const cronJob = require('../models/cronJob');
const verifyToken = require('../bin/middlewear/auth');
var router = express.Router();

/* GET home page. */
router.get('/', async function (req, res, next) {
  try {

    res.render('layout', { title: 'SMART Launch App' });

  } catch (err) {
    console.log("router.get ~ err:", err)
  }
});

router.get('/home', verifyToken, async (req, res) => {
  let role = req.cookies.role;
  let where = {}
  if (role == 'user') {
    where = { userId: req?.user?.userId }
  }
  const cronJobs = await cronJob
    .find(where)
    .sort({ updatedAt: -1 })
  res.render('home', { role, title: 'SMART Launch App', cronJob: cronJobs }); // Ensure this matches your ejs file name in the views folder
});


module.exports = router;
