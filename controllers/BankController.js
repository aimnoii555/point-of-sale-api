const express = require('express')
const BankModel = require('../models/BankModel')
const app = express()

app.get('/bank/list', async (req, res) => {
    try {
        const data = await BankModel.findAll()
        res.send({ status: true, data })
    } catch (error) {
        res.send({ status: false, error: error.message })
    }
})


module.exports = app;
