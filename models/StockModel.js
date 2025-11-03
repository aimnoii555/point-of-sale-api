const { DataTypes } = require('sequelize')
const connect = require('../config/connect')

const StockModel = connect.define('stock', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    product_id: {
        type: DataTypes.BIGINT,
    },
    qty: {
        type: DataTypes.BIGINT
    },
    user_id: {
        type: DataTypes.BIGINT
    }
})

// StockModel.sync({ alter: true })
module.exports = StockModel
