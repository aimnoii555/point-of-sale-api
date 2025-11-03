const { DataTypes } = require('sequelize')
const connect = require('../config/connect')

const ChangePackageModel = connect.define('package_member', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,

    },
    package_id: {
        type: DataTypes.BIGINT
    },
    user_id: {
        type: DataTypes.BIGINT
    },
    pay_date: {
        type: DataTypes.DATE
    },
    pay_hours: {
        type: DataTypes.BIGINT
    },
    pay_minutes: {
        type: DataTypes.BIGINT
    },
    remark: {
        type: DataTypes.STRING
    },

})

ChangePackageModel.sync({ alter: true })
module.exports = ChangePackageModel
