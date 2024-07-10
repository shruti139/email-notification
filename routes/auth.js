var express = require('express');
const { login } = require('../controller/auth');
const { validateUser } = require('../validation/user');
var router = express.Router();
/* GET users listing. */

router.post('/login', validateUser, login);

module.exports = router;
