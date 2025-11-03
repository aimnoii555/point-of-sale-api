const express = require('express')
const AdminModel = require('../models/AdminModel')
const app = express()
const jwt = require('jsonwebtoken')
const { getAdminId, isLogin } = require('../controllers/Service')
const MemberModel = require('../models/MemberModel')
const PackageModel = require('../models/PackageModel')


app.post('/admin/signin', async (req, res) => {
    try {
        const data = await AdminModel.findOne({
            where: {
                username: req.body.username,
                password: req.body.password
            }
        })

        if (data) {
            let token = jwt.sign({ id: data.id, username: req.body.username }, process.env.SECRET_KEY, { expiresIn: '7d' })
            
            return res.send({ status: true, token })
        } else {
            return res.status(401).send({ status: false, message: "Invalid" })
        }

    } catch (error) {
        res.send({ status: false, error: error.message })
    }
})

app.get('/admin/info', isLogin, async (req, res) => {
    try {
        const data = await AdminModel.findByPk(await getAdminId(req), {
            attributes: ['id', 'name', 'username'],
        })
        res.send({ status: true, data })
    } catch (error) {
        res.send({ status: false, error: error.message })

    }
})

app.post('/admin/create', isLogin, async (req, res) => {
    try {
        await AdminModel.create(req.body)
        res.send({ status: true })
    } catch (error) {
        res.send({ status: false, error: error.message })

    }
})

app.get('/admin/list', isLogin, async (req, res) => {
    try {
        const data = await AdminModel.findAll({
            attributes: ['email', 'name', 'username', 'role', 'id']
        })

        res.send({ status: true, data })
    } catch (error) {
        res.send({ status: false, error: error.message })

    }
})

app.delete('/admin/delete/:id', isLogin, async (req, res) => {
    try {
        await AdminModel.destroy({
            where: {
                id: req.params.id
            }
        })
        res.send({ status: true })
    } catch (error) {
        res.send({ status: false, error: error.message })

    }
})

app.post('/admin/update/:id', isLogin, async (req, res) => {
    try {
        if (!req.body.password || req.body.password.trim() == '') {
            delete req.body.password
        }

        await AdminModel.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        res.send({ status: true })
    } catch (error) {
        res.send({ status: false, error: error.message })

    }
})

app.post('/admin/chnage-profile', isLogin, async (req, res) => {
    if (!req.body.password || req.body.password.trim() == '') {
        delete req.body.password
    }

    try {
        await AdminModel.update(req.body, {
            where: {
                id: req.body.id
            }
        })

        res.send({ status: true })
    } catch (error) {
        res.send({ status: false, error: error.message })

    }
})

module.exports = app;
