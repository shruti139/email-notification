var express = require('express');
const { login } = require('../controller/auth');
var router = express.Router();
/* GET users listing. */

router.post('/login', login);

module.exports = router;
