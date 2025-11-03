const { DataTypes } = require('sequelize')
const connect = require('../config/connect')

const BillSaleModel = connect.define('bills', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    pay_date: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'open',
        allowNull: false,
    },
    user_id: {
        type: DataTypes.BIGINT
    }
})

// BillSaleModel.sync({ alter: true })
module.exports = BillSaleModel
