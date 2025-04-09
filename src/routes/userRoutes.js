const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
router.use(userController.validateToken);

router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUsers);
router.delete('/users/:id', userController.deleteUsers);

module.exports = router;
