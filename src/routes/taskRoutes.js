const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const userController = require('../controllers/userController');

router.get('/tasks', userController.validateToken, taskController.getTasks);
router.get('/tasks/:id', userController.validateToken, taskController.getTaksById);
router.put('/tasks/:id', userController.validateToken, taskController.updateTasks);
router.delete('/tasks/:id', userController.validateToken, taskController.deleteTasks);

module.exports = router;
