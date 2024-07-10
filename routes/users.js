var express = require('express');
var router = express.Router();
const { getUsers, deleteUserById, updateUserById, createUser } = require('../controller/user');
const verifyToken = require('../middlewear/auth');
const { validateUser } = require('../validation/user');

router.get('/getUsers', verifyToken, getUsers);
router.put('/updateUser/:id', verifyToken, updateUserById);
router.delete('/deleteUser/:id', verifyToken, deleteUserById);
router.post('/createUser', verifyToken, validateUser, createUser);

module.exports = router;