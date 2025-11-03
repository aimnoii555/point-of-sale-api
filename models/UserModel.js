const { DataTypes } = require('sequelize')
const connect = require('../config/connect')

const UserModel = connect.define('users', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
    },
    username: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING
    },
    user_id: {
        type: DataTypes.BIGINT
    }
})

// UserModel.sync({ alter: true })
module.exports = UserModel
