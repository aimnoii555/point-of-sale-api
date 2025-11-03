const { Sequelize } = require('sequelize')


const sequelize = new Sequelize('db_workshop_pos', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
})


module.exports = sequelize;
