const database = require("../config/database")

class Task {
   constructor() {
      this.model = database.define('tasks', {
         id: {
            type: database.Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
         },
         title: {
            type: database.Sequelize.STRING
         },
         status: {
            type: database.Sequelize.STRING
         },
         projectId: {
            type: database.Sequelize.INTEGER,
            references: {
               model: 'projects',
               key: 'id'
            }
         },
         userId: {
            type: database.Sequelize.INTEGER,
            references: {
               model: 'users',
               key: 'id'
            }
         }

      })
   }
}

module.exports = (new Task).model
