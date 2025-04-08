const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/users', userController.validateToken, userController.getUsers);
router.get('/users/:id', userController.validateToken, userController.getUserById);
router.post('/users', userController.createUsers);
router.put('/users/:id', userController.validateToken, userController.updateUsers);
router.delete('/users/:id', userController.validateToken, userController.deleteUsers);

module.exports = router;
