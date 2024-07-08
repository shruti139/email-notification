var express = require('express');
const { login, createUser } = require('../controller/auth');
var router = express.Router();
/* GET users listing. */

router.post('/login', login);
router.post('/register', createUser);

module.exports = router;
