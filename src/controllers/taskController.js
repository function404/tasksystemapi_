const Project = require('../models/project')
const Task = require('../models/task')
const User = require('../models/user')

class TaskController {
   async getTasks(req, res) {
      try {
         const tasks = await Task.findAll()
         return res.json(tasks)
      } catch (error) {
         res.status(500).json('Erro ao buscar tarefas!', error)
      }

   }

   async getTaksById(req, res) {
      try {
         const { id } = req.params
         const idTask = Number(id)
         if (!idTask) {
            return res.status(400).json('ID não informado!')
         }

         const task = await Task.findByPk(idTask)
         if (!task) {
            return res.status(404).json('Tarefa não encontrada!')
         }

         return res.json(task)
      } catch (error) {
         res.status(500).json('Erro ao buscar tarefa por ID!', error)
      }
      
   }

   async createTasks(req, res) {
      try {
         const { title, status, projectId, userId } = req.body

         if (!title || !status || !projectId || !userId) {
            return res.status(400).json('Preencha todos os campos!')
         }

         const existingTask = await Task.findOne({ where: { title } })
         if (existingTask) {
            return res.status(400).json('Tarefa com esse título já existe!')
         }

         const project = await Project.findByPk(projectId)
         if (!project) {
            return res.status(404).json('Projeto não encontrado!')
         }

         const user = await User.findByPk(userId)
         if (!user) {
            return res.status(404).json('Usuário não encontrado!')
         }

         const task = await Task.create({ title, status, projectId, userId })
         return res.status(201).json(task)  
      } catch (error) {
         res.status(500).json('Erro ao criar tarefa!', error)
      }
      
   }

   async updateTasks(req, res) {
      try {
         const { id } = req.params
         const { title, status, projectId, userId } = req.body
         const idTask = Number(id)

         const task = await Task.findByPk(idTask)
         if (!task) {
            return res.status(404).json('Tarefa não encontrada')
         }

         const project = await Project.findByPk(projectId)
         if (!project) {
            return res.status(404).json('Projeto não encontrado!')
         }

         const user = await User.findByPk(userId)
         if (!user) {
            return res.status(404).json('Usuário não encontrado!')
         }

         const existingTask = await Task.findOne({ where: { title } })
         if (existingTask && existingTask.id !== idTask) {
            return res.status(400).json('Tarefa com esse título já existe!')
         }

         task.title = title
         task.status = status
         task.projectId = projectId
         task.userId = userId
         await task.save()

         return res.status(200).json(task)
      } catch (error) {
         res.status(500).json('Erro ao atualizar tarefa!', error)
      }
      
   }

   async deleteTasks(req, res) {
      try {
         const { id } = req.params
         const idTask = Number(id)
         if (!idTask) {
            return res.status(400).json('ID não informado!')
         }

         const task = await Task.findByPk(idTask)
         if (!task) {
            return res.status(404).json('Tarefa não encontrada')
         }

         task.destroy()
         return res.status(200).json('Tarefa deletada com sucesso')
      } catch (error) {
         res.status(500).json('Erro ao deletar tarefa!', error)
      }
   }
}

module.exports = (new TaskController())
