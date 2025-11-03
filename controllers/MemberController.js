const express = require('express')
const MemberModel = require('../models/MemberModel')
const app = express()
const jwt = require('jsonwebtoken');
const { getToken, isLogin, getMemberId } = require('./Service');
const PackageModel = require('../models/PackageModel');
const dotenv = require('dotenv');
const { comparePassword } = require('../utils/Auth');

app.post('/member/signin', async (req, res) => {

    const { phone, password } = req.body;

    try {

        const member = await MemberModel.findOne({ where: { phone } });
        const compare = await comparePassword(password, member.password)

        console.log('compare ' + compare)
        
        if (!compare) {
            return res.status(401).send({
                status: false,
                message: 'Phone Number or password is invalid.'
            });
        }

        const payload = { id: member.id };
        const token = jwt.sign(payload, process.env.SECRET_KEY);

        return res.status(200).send({ status: true, token, data: member });
    } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
    }
});


app.get('/member/info', isLogin, async (req, res) => {
    try {
        const token = getToken(req)
        const payload = jwt.decode(token.trim())

        MemberModel.belongsTo(PackageModel, {
            foreignKey: 'package_id'
        })

        const member = await MemberModel.findByPk(payload.id, {
            attributes: ['id', 'name'],
            include: [
                { model: PackageModel, attributes: ["name", "bill_amount"] },
            ]
        })

        res.send({ status: true, data: member })
    } catch (error) {
        res.send({ error: error.message })
    }
})


app.put('/member/update-profile', isLogin, async (req, res) => {


    try {
        const id = await getMemberId(req)
        await MemberModel.update(req.body, {
            where: {
                id: id
            }
        })
        res.send({ status: true, message: 'Updated Success' })
    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
})

app.get('/member/list', isLogin, async (req, res) => {
    try {
        MemberModel.belongsTo(PackageModel, {
            foreignKey: 'package_id'
        })
        const data = await MemberModel.findAll({
            order: [['id', 'desc']],
            attributes: ['id', 'name', 'phone', 'createdAt', 'updatedAt'],
            include: {
                model: PackageModel
            }
        })
        res.send({ status: true, data })
    } catch (error) {
        res.status(500).send({ status: false, error: error.message })

    }
})

module.exports = app;
