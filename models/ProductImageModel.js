const { DataTypes } = require('sequelize')
const connect = require('../config/connect')

const ProductImageModel = connect.define('product_image', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },
    product_id: {
        type: DataTypes.BIGINT
    },
    image_path: {
        type: DataTypes.STRING,
    },
    isMain: {
        type: DataTypes.BOOLEAN
    }
})

// ProductImageModel.sync({ alter: true });

module.exports = ProductImageModel;
