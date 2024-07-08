var express = require('express');
var router = express.Router();
const cron = require('node-cron');
/* GET users listing. */
router.get('/', function(req, res, next) {
 
  res.send('respond with a resource');
});

module.exports = router;
