const Project = require('../models/project');
const Task = require('../models/task');
const User = require('../models/user');

class TaskController {
   async getTasks(req, res) {
      const tasks = await Task.findAll();
      return res.json(tasks);
   }

   async getTaksById(req, res) {
      const { id } =req.params;
      if (!id) {
         return res.status(400).json('ID não informado!');
      }

      const task = await Task.findByPk(id);
      if (!task) {
         return res.status(404).json('Tarefa não encontrada!');
      }

      return res.json(task);
   }

   async createTasks(req, res) {
      const { title, status, projectId, userId } = req.body;

      if (!title || !status || !projectId || !userId) {
         return res.status(400).json('Preencha todos os campos!');
      }

      const existingTask = await Task.findOne({ where: { title } });
      if (existingTask) {
         return res.status(400).json('Tarefa com esse título já existe!');
      }

      const project = await Project.findByPk(projectId);
      if (!project) {
         return res.status(404).json('Projeto não encontrado!');
      }

      const user = await User.findByPk(userId);
      if (!user) {
         return res.status(404).json('Usuário não encontrado!');
      }

      const task = await Task.create({ title, status, projectId, userId });
      return res.status(201).json(task);
   }

   async updateTasks(req, res) {
      const { id } = req.params;
      const { title, status, projectId, userId } = req.body;

      const task = await Task.findByPk(id);
      if (!task) {
         return res.status(404).json('Tarefa não encontrada');
      }

      const project = await Project.findByPk(projectId);
      if (!project) {
         return res.status(404).json('Projeto não encontrado!');
      }

      const user = await User.findByPk(userId);
      if (!user) {
         return res.status(404).json('Usuário não encontrado!');
      }

      const existingTask = await Task.findOne({ where: { title } });
      if (existingTask && existingTask.id !== Number(id)) {
         return res.status(400).json('Tarefa com esse título já existe!');
      }

      task.title = title;
      task.status = status;
      task.projectId = projectId;
      task.userId = userId;
      await task.save();

      return res.status(200).json(task);
   }

   async deleteTasks(req, res) {
      const { id } = req.params;

      const task = await Task.findByPk(id);
      if (!task) {
         return res.status(404).json('Tarefa não encontrada');
      }

      task.destroy();
      return res.status(200).send('Tarefa deletada com sucesso');
   }
}

module.exports = (new TaskController());
