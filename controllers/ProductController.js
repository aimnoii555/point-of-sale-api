const express = require('express')
const app = express()
const ProdcutModel = require('../models/ProductModel')
const { isLogin } = require('./Service')
const ProductImageModel = require('../models/ProductImageModel')
const Service = require('./Service')

app.post('/product/insert', isLogin, async (req, res) => {
    try {
        let payload = req.body;
        payload.user_id = await Service.getMemberId(req)

        const product = await ProdcutModel.create(req.body);

        if (!product) {
            return res.send({ status: false, message: 'Add product failed.' })
        }

        res.send({ status: true, message: 'Created' })
    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
})

app.get('/products/list', isLogin, async (req, res) => {

    try {

        const products = await ProdcutModel.findAll({
            order: [['id', 'desc']],
            where: {
                user_id: await Service.getMemberId(req)
            }
        })

        if (!products) {
            return res.send({ status: false, message: 'Prodcut not found!' })
        }

        res.send({ status: true, data: products })
    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
})

app.delete('/product/delete/:id', isLogin, async (req, res) => {
    ProdcutModel.hasMany(ProductImageModel)
    try {
        const deleted = await ProdcutModel.destroy({
            where: {
                id: req.params.id
            }
        })
        if (!deleted) {
            return res.send({ status: false, message: 'Delete fail' })
        }

        res.send({ status: true, message: 'Deleted' })
    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
})

app.post('/product/update', isLogin, async (req, res) => {
    try {
        let payload = req.body;
        payload.user_id = await Service.getMemberId(req)

        const updated = await ProdcutModel.update(payload, {
            where: {
                id: req.body.id
            }
        })

        if (!updated) {
            return res.send({ status: false, message: 'Update fail' })
        }
        res.send({ status: true, message: 'Updated' })
    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
})

app.get('/product/list-for-sale', isLogin, async (req, res) => {

    ProdcutModel.hasMany(ProductImageModel, {
        foreignKey: 'product_id',
    })
    try {
        const sale = await ProdcutModel.findAll({
            order: [['id', 'desc']],
            include: {
                model: ProductImageModel,
                where: {
                    isMain: true
                }
            },
            where: {
                user_id: await Service.getMemberId(req)
            }
        })

        res.send({ status: true, data: sale })
    } catch (error) {
        res.status(500).send({ status: false, error: error.message })

    }
})


module.exports = app;
