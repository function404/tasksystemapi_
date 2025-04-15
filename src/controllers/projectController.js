const Project = require('../models/project');
const Task = require('../models/task');

class ProjectController {
   async getProject(req, res) {
      const projects = await Project.findAll();
      return res.json(projects);
   }

   async getProjectById(req, res) {
      const { id } = req.params;
      const idProject = Number(id);
      if (!idProject) {
         return res.status(400).json('ID não informado!');
      }

      const project = await Project.findByPk(idProject);

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
      const idProject = Number(id);

      const project = await Project.findByPk(idProject);
      if (!project) {
         return res.status(404).json('Projeto não encontrado');
      }

      const existingProject = await Project.findOne({ where: { name } });
      if (existingProject && existingProject.id !== idProject) {
         return res.status(400).json('Projeto com esse nome já existe!');
      }

      project.name = name;
      project.description = description;
      await project.save();

      return res.status(200).json(project);
   }

   async deleteProject(req, res) {
      const { id } = req.params;
      const idProject = Number(id);
      if (!idProject) {
         return res.status(404).json('ID não informado!');
      }

      const project = await Project.findByPk(idProject);
      if (!project) {
         return res.status(404).json('Projeto não encontrado');
      }

      await Task.destroy({ where: { projectId: idProject } });

      project.destroy();
      return res.status(200).json('Projeto deletado com sucesso juntamente com as tarefas associadas!');
   }
}

module.exports = (new ProjectController());
