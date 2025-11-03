const { DataTypes } = require('sequelize')
const connect = require('../config/connect')
const sequelize = require('../config/connect')

const ProdcutModel = sequelize.define('products', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    barcode: {
        type: DataTypes.STRING(255),
    },
    name: {
        type: DataTypes.STRING(255)
    },
    cost: {
        type: DataTypes.BIGINT,
    },
    price: {
        type: DataTypes.BIGINT,
    },
    detail: {
        type: DataTypes.STRING(255)
    },
    user_id: {
        type: DataTypes.BIGINT
    }
})


// ProdcutModel.sync({ alter: true })
module.exports = ProdcutModel;
