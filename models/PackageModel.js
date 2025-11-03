const { DataTypes } = require('sequelize')
const connect = require('../config/connect')

const PackageModel = connect.define('packages', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(255),
    },
    bill_amount: {
        type: DataTypes.BIGINT
    },
    price: {
        type: DataTypes.BIGINT
    }
})

module.exports = PackageModel
