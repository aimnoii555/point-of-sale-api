const { DataTypes } = require('sequelize')
const connect = require('../config/connect')

const AdminModel = connect.define('admin', {
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
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING
    },
})

AdminModel.sync({ alter: true })
module.exports = AdminModel
