const express = require('express');
const router = express.Router();

const projectController = require('../controllers/projectController');
const userController = require('../controllers/userController');

router.get('/projects', userController.validateToken, projectController.getProject);
router.get('/projects/:id', userController.validateToken, projectController.getProjectById);
router.post('/projects', userController.validateToken, projectController.createProject);
router.put('/projects/:id', userController.validateToken, projectController.updateProject);
router.delete('/projects/:id', userController.validateToken, projectController.deleteProject);

module.exports = router;
