var express = require('express');
var router = express.Router();
const { getUsers, deleteUserById, updateUserById, createUser } = require('../controller/user');
const verifyToken = require('../middlewear/auth');

router.get('/getUsers', verifyToken, getUsers);
router.put('/updateUser/:id', verifyToken, updateUserById);
router.delete('/deleteUser/:id', verifyToken, deleteUserById);
router.post('/createUser', verifyToken, createUser);

module.exports = router;