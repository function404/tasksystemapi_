const Project = require('../models/project');
const Task = require('../models/task');

class ProjectController {
   async getProject(req, res) {
      const projects = await Project.findAll();
      return res.json(projects);
   }

   async getProjectById(req, res) {
      const { id } = req.params;
      if (id === undefined) {
         return res.status(400).json('ID não informado!');
      }

      const project = await Project.findByPk(id);

      if (!project) {
         return res.status(400).json('Projeto não encontrado!');
      }

      return res.json(project);
   }

   async createProject(req, res) {
      const { name, description } = req.body;

      if (!name || !description) {
         return res.status(400).json('Preencha todos os campos!');
      }

      const existingProject = await Project.findOne({ where: { name } });
      if (existingProject) {
         return res.status(400).json('Projeto com esse nome já existe!');
      }

      const project = await Project.create({ name, description });
      return res.status(201).json(project);
   }

   async updateProject(req, res) {
      const { id } = req.params;
      const { name, description } = req.body;

      const project = await Project.findByPk(id);
      if (!project) {
         return res.status(404).json('Projeto não encontrado');
      }

      const existingProject = await Project.findOne({ where: { name } });
      if (existingProject && existingProject.id !== Number(id)) {
         return res.status(400).json('Projeto com esse nome já existe!');
      }

      project.name = name;
      project.description = description;
      await project.save();

      return res.status(200).json(project);
   }

   async deleteProject(req, res) {
      const { id } = req.params;
      if (!id) {
         return res.status(404).send('ID não informado!');
      }

      const project = await Project.findByPk(id);
      if (!project) {
         return res.status(404).json('Projeto não encontrado');
      }

      const tarefas = await Task.findAll({ where: { projectId: id } });
      if (tarefas.length > 0) {
         await Task.destroy({ where: { projectId: id } });
      };

      project.destroy();
      return res.status(200).send('Projeto deletado com sucesso juntamente com as tarefas associadas!');
   }
}

module.exports = (new ProjectController());
