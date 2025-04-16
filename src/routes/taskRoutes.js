const express = require('express')
const router = express.Router()

const taskController = require('../controllers/taskController')
const userController = require('../controllers/userController')
router.use(userController.validateToken)

router.get('/tasks', taskController.getTasks)
router.get('/tasks/:id', taskController.getTaksById)
router.post('/tasks', taskController.createTasks)
router.put('/tasks/:id', taskController.updateTasks)
router.delete('/tasks/:id', taskController.deleteTasks)

module.exports = router
