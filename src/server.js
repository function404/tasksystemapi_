/**
 * Aula Backend - 2025-03-17
 * Dev - Lincoln
 * 3° Fase - Análise e Desenvolvimento de Sistemas
 * Disciplina - Desenvolvimento Back-end 
 */

const express = require('express')

const app = express()
app.use(express.json())

const database = require('./config/database')

const userController = require('./controllers/userController')

const userRoutes = require('./routes/userRoutes')
const projectRoutes = require('./routes/projectRoutes')
const taskRoutes = require('./routes/taskRoutes')

const port = 3001

app.post('/login', userController.login)
app.post('/register', userController.createUsers)

app.use('/api', userRoutes)
app.use('/api', taskRoutes)
app.use('/api', projectRoutes)

database.sync({ force: true })
    .then(() => {
        app.listen(Number(port), () => 
            console.log(`🚀 Servidor rodando na porta: ${port}`)
        )
    })
    .catch(error => {
        console.error('Erro ao sincronizar o banco de dados:', error)
    })

