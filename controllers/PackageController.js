const express = require('express')
const app = express()
const PackageModel = require('../models/PackageModel')
const MemberModel = require('../models/MemberModel')
const BillSaleModel = require('../models/BillSaleModel')
const { isLogin, getMemberId } = require('./Service')


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
        const result = await MemberModel.create(req.body)
        res.send({ status: true, message: 'Created success', result: result })
    } catch (error) {
        res.status(500).json({ error: error.message, status: false })
    }
})

app.get('/package/count-bill', isLogin, async (req, res) => {
    try {
        const data = await BillSaleModel.findAll({
            where: {
                user_id: await getMemberId(req)
            }
        })
        res.send({ status: true, total_bill: data.length })
    } catch (error) {
        res.status(500).json({ error: error.message, status: false })

    }
})

module.exports = app;
