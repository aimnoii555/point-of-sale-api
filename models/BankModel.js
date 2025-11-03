const { DataTypes } = require('sequelize')
const connect = require('../config/connect')

const BankModel = connect.define('banks', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    bank_type: {
        type: DataTypes.STRING,
    },
    bank_code: {
        type: DataTypes.STRING
    },
    bank_name: {
        type: DataTypes.STRING
    },
    bank_branch: {
        type: DataTypes.STRING
    }
})

BankModel.sync({ alter: true })
module.exports = BankModel
