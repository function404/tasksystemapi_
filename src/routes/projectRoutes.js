const express = require('express');
const router = express.Router();

const projectController = require('../controllers/projectController');
const userController = require('../controllers/userController');
router.use(userController.validateToken);

router.get('/projects', projectController.getProject);
router.get('/projects/:id', projectController.getProjectById);
router.post('/projects', projectController.createProject);
router.put('/projects/:id', projectController.updateProject);
router.delete('/projects/:id', projectController.deleteProject);

module.exports = router;
