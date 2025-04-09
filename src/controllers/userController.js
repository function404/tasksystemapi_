const Task = require('../models/task');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const JWT_SECRET_KEY = 'functionss';

class UserController {
   async getUsers(req, res) {
      const users = await User.findAll();
      return res.json(users);
   }

   async getUserById(req, res) {
      const { id } = req.params;
      if (id === undefined) {
         return res.status(400).json('ID não informado!')
      }

      const user = await User.findByPk(id);

      if (!user) {
         return res.status(400).json('Usuário não encontrado!');
     }

      return res.json(user)
   }

   async createUsers(req, res) {
      const { name, email, password } = req.body;

      if ( !name || !email || !password) {
         return res.status(400).json('Preencha todos os campos!');
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
         return res.status(400).json('Email já cadastrado!');
      }

      const encryptedPassword = await bcrypt.hash(password, saltRounds);

      const user = await User
         .create({ name, email, password: encryptedPassword });

      return res.json(user);
   }

   async updateUsers(req, res) {
      const { id } = req.params;
      const { name, email, password } = req.body;
      if ( !id || !name || !email || !password) {
         return res.status(400).json('Preencha todos os campos!');
      }

      const user = await User.findByPk(id);
      if (!user) {
         return res.status(404).send('Usuário não encontrado');
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser && existingUser.id !== Number(id)) {
         return res.status(400).json('Email já cadastrado!');
      }

      user.name = name;
      user.email = email;
      user.password = password;

      const encryptedPassword = await bcrypt.hash(password, saltRounds);
      user.password = encryptedPassword;
      user.save();

      return res.status(200).json(user);
   }

   async deleteUsers(req, res) {
      const { id } = req.params;
      if (!id) {
         return res.status(404).send('ID não informado!');
      }

      const user = await User.findByPk(id);
      if (!user) {
         return res.status(404).send('Usuário não encontrado!');
      }

      const tasks = await Task.findAll({ where: { userId: id }});

      if (tasks.length > 0) {
         await Task.destroy({ where: { userId: id }});
      }

      user.destroy();
      return res.status(200).send('Usuário deletado com sucesso juntamente com as tarefas associadas!');
   }

   async login(req, res) {
      const { email, password } = req.body;
      if (!email || !password) {
         return res.status(400).json('Preencha todos os campos!');
      }

      const user = await User.findOne({ where: { email} });
      if (!user) {
         return res.status(400).json('Usuário não encontrado!');
      }

      const isPaswordValid = await bcrypt.compare(password, user.password);
      if (!isPaswordValid) {
         return res.status(400).json('Senha inválida!');
      }

      const jwtToken = jwt.sign({ id: user.id }, JWT_SECRET_KEY, { expiresIn: "1h" });

      return res.status(200).json({ token: jwtToken });
   }

   async validateToken(req, res, next) {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
   
      if (!token) {
         return res.status(401).json('Token não enviado!');
      }
   
      try {
         const payload = jwt.verify(token, JWT_SECRET_KEY);
         req.user = payload;
         next();
      } catch (err) {
         return res.status(401).json('Token inválido!');
      }
   }
}

module.exports = (new UserController());
