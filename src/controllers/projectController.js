const Project = require('../models/project')
const Task = require('../models/task')

class ProjectController {
   async getProject(req, res) {
      try {
         const projects = await Project.findAll()
         return res.json(projects)  
      } catch (error) {
         return res.status(500).json('Erro ao buscar projetos!', error)
      }
   }

   async getProjectById(req, res) {
      try {
         const { id } = req.params
         const idProject = Number(id)
         if (!idProject) {
            return res.status(400).json('ID não informado!')
         }

         const project = await Project.findByPk(idProject)

         if (!project) {
            return res.status(400).json('Projeto não encontrado!')
         }

         return res.json(project) 
      } catch (error) {
         return res.status(500).json('Erro ao buscar projeto por ID!', error)
      }
   }

   async createProject(req, res) {
      try {
         const { name, description } = req.body

         if (!name || !description) {
            return res.status(400).json('Preencha todos os campos!')
         }

         const existingProject = await Project.findOne({ where: { name } })
         if (existingProject) {
            return res.status(400).json('Projeto com esse nome já existe!')
         }

         const project = await Project.create({ name, description })
         return res.status(201).json(project)
      } catch (error) {
         return res.status(500).json('Erro ao criar projeto!', error)
      }
   }

   async updateProject(req, res) {
      try {
         const { id } = req.params
         const { name, description } = req.body
         const idProject = Number(id)

         const project = await Project.findByPk(idProject)
         if (!project) {
            return res.status(404).json('Projeto não encontrado')
         }

         const existingProject = await Project.findOne({ where: { name } })
         if (existingProject && existingProject.id !== idProject) {
            return res.status(400).json('Projeto com esse nome já existe!')
         }

         project.name = name
         project.description = description
         await project.save()

         return res.status(200).json(project)
      } catch (error) {
         res.status(500).json('Erro ao atualizar projeto!', error)
      }
   }

   async deleteProject(req, res) {
      try {
         const { id } = req.params
         const idProject = Number(id)
         if (!idProject) {
            return res.status(404).json('ID não informado!')
         }

         const project = await Project.findByPk(idProject)
         if (!project) {
            return res.status(404).json('Projeto não encontrado')
         }

         const tasks = await Task.findAll({ where: { projectId: id } })
         if (tasks.length > 0) {
            await Task.destroy({ where: { projectId: id } })
         }

         project.destroy()
         return res.status(200).json('Projeto e tarefas associadas deletados com sucesso!')
      } catch (error) {
         return res.status(500).json('Erro ao deletar projeto!', error)
      }
   }
}

module.exports = (new ProjectController())
