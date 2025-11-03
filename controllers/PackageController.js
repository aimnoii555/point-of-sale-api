const express = require('express')
const app = express()
const PackageModel = require('../models/PackageModel')
const MemberModel = require('../models/MemberModel')
const BillSaleModel = require('../models/BillSaleModel')
const { isLogin, getMemberId } = require('./Service')
const { Op } = require('sequelize')
const BankModel = require('../models/BankModel')
const ChangePackageModel = require('../models/ChangePackageModel')
const { hashPassword } = require('../utils/Auth')


app.get('/package/list', async (req, res) => {
    try {
        const result = await PackageModel.findAll({
            order: ['price']
        })

        res.send(result)
    } catch (error) {
        res.status(500).json({ error: error.message, status: false })
    }
})

app.post('/package/member-register', async (req, res) => {
    try {

        const checkPhone = await MemberModel.findOne({
            where: {
                phone: req.body.phone
            }
        })

        if (checkPhone) {
            res.send({ status: false, message: 'Phone Number already exists.' })
            return;
        }

        const hash = await hashPassword(req.body.password);
        const payload = {
            package_id: req.body.package_id,
            name: req.body.name,
            phone: req.body.phone,
            password: hash
        }
        const result = await MemberModel.create(payload)
        res.send({ status: true, message: 'Created success', result: result })
    } catch (error) {
        res.status(500).json({ error: error.message, status: false })
    }
})

app.get('/package/count-bill', isLogin, async (req, res) => {
    try {
        const myDate = new Date();

        const y = myDate.getFullYear();
        const m = myDate.getMonth();

        const startOfMonth = new Date(y, m, 1)
        const endOfMonth = new Date(y, m + 1, 0, 23, 59, 59)


        const data = await BillSaleModel.findAll({
            where: {
                user_id: await getMemberId(req),
                createdAt: {
                    [Op.gte]: startOfMonth,
                    [Op.lte]: endOfMonth
                }
            }
        })
        res.send({ status: true, total_bill: data.length })
    } catch (error) {
        res.status(500).json({ error: error.message, status: false })

    }
})

app.get('/package/change-package/:id', isLogin, async (req, res) => {
    try {
        const payload = {
            user_id: await getMemberId(req),
            package_id: req.params.id,
        }

        await ChangePackageModel.create(payload)
        return res.send({ status: true })


    } catch (error) {
        res.status(500).json({ error: error.message, status: false })

    }
})

module.exports = app;
