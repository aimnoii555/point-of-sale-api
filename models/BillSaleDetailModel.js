const { DataTypes } = require('sequelize')
const connect = require('../config/connect')

const BillSaleDetailModel = connect.define('bill_sale_detail', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    bill_sale_id: {
        type: DataTypes.BIGINT,
    },
    product_id: {
        type: DataTypes.BIGINT
    },
    qty: {
        type: DataTypes.BIGINT
    },
    price: {
        type: DataTypes.BIGINT,
    },
    user_id: {
        type: DataTypes.BIGINT
    }
})

// BillSaleDetailModel.sync({ alter: true })
module.exports = BillSaleDetailModel;
