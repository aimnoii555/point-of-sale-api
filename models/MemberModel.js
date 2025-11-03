const { DataTypes } = require('sequelize')
const connect = require('../config/connect')
const sequelize = require('../config/connect')


// const PackageModel = require('./PackageModel')

const MemberModel = sequelize.define('members', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    package_id: {
        type: DataTypes.BIGINT,
    },
    name: {
        type: DataTypes.STRING(255)
    },
    phone: {
        type: DataTypes.STRING(50)
    },
    password: {
        type: DataTypes.STRING(255)
    }

})

// MemberModel.sync({ alter: true })

// MemberModel.belongsTo(PackageModel, {
//     foreignKey: 'package_id'
// })

module.exports = MemberModel
