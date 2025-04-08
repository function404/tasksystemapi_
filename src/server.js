/**
 * Aula Backend - 2025-03-17
 * Dev - Lincoln
 * 3° Fase - Análise e Desenvolvimento de Sistemas
 * Disciplina - Desenvolvimento Back-end 
 */

const express = require('express');

const app = express();
app.use(express.json());

const database = require('./config/database');

const userController = require('./controllers/userController');

const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

const port = 3001;

app.post('/login', userController.login);
app.post('/register', userController.createUsers);

app.use('/api', userRoutes);
app.use('/api', projectRoutes);
app.use('/api', taskRoutes);

database.sync({ force: true })
    .then(() => {
        app.listen(Number(port), () => 
            console.log(`🚀fiuu🚀 Servidor rodando na porta 🚀paaa🚀${port}`)
        );
    })
    .catch(err => {
        console.error('Erro ao sincronizar o banco de dados:', err);
    });

