const express = require('express')
const UserModel = require('../models/UserModel')
const { isLogin } = require('./Service')
const Service = require('./Service')
const app = express()

app.get('/users/list', isLogin, async (req, res) => {
    try {
        const data = await UserModel.findAll({
            order: [["id", "desc"]],
            attributes: ['id', 'role', 'name', 'username'],
            where: {
                user_id: await Service.getMemberId(req)
            }
        })

        res.send({ status: true, data })
    } catch (error) {
        res.status(500).send({ status: false, error: error.message })

    }
})

app.post('/users/insert', isLogin, async (req, res) => {
    try {
        let payload = req.body;
        payload.user_id = await Service.getMemberId(req)
        await UserModel.create(payload)

        res.send({ status: true })
    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
})

app.delete('/users/delete/:id', isLogin, async (req, res) => {
    try {
        await UserModel.destroy({
            where: {
                id: req.params.id
            }
        })
        res.send({ status: true })
    } catch (error) {
        res.status(500).send({ status: false, error: error.message })

    }
})

app.post('/users/update', isLogin, async (req, res) => {

    try {
        if (!req.body.password || req.body.password.trim() == '') {
            delete req.body.password
        }

        let payload = req.body;
        payload.user_id = await Service.getMemberId(req)
        await UserModel.update(payload, {
            where: {
                id: req.body.id
            }
        })
        res.send({ status: true })
    } catch (error) {
        res.status(500).send({ status: false, error: error.message })

    }
})






module.exports = app;
