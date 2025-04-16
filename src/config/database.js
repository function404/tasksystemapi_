const Sequelize = require('sequelize')

class Database extends Sequelize {
   constructor() {
      super('bancoDoMVC', 'root', '', {
         host: 'localhost',
         dialect: 'mysql',
         logging: false,
      })
   }
}

module.exports = new Database()