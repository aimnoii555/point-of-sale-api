const express = require('express')
const { isLogin } = require('./Service')
const ProductImageModel = require('../models/ProductImageModel')
const app = express()
const fileUpload = require('express-fileupload')
const path = require('path')

app.use(fileUpload())

app.post('/product-image/insert', isLogin, async (req, res) => {
    try {
        const timestamp = new Date().getTime();
        const newName = req.files.file.md5 + timestamp;
        const file = req.files.file

        const ext = path.extname(file.name)
        const uploadPath = __dirname + '/../uploads/' + newName + ext

        file.mv(uploadPath, async (err) => {
            if (err) throw new Error(err)

            await ProductImageModel.create({
                isMain: false,
                image_path: newName + ext,
                product_id: req.body.product_id
            })

            return res.send({ status: true, message: 'Uploaded' })
        })
    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
})

app.get('/product-image/list/:id', isLogin, async (req, res) => {
    try {
        // console.log(req.params)
        const data = await ProductImageModel.findAll({
            where: {
                product_id: req.params.id
            },
            order: [['id', 'desc']]
        })

        res.send({ status: true, data })
    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
})


app.delete('/product-image/delete/:id', isLogin, async (req, res) => {
    try {

    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
})

app.get('/product-image/choose-main-img/:id/:product_id', isLogin, async (req, res) => {
    console.log(req.params)
    try {

        await ProductImageModel.update({
            isMain: false,
        },
            {
                where: {
                    product_id: req.params.product_id
                }
            }
        );
        await ProductImageModel.update({
            isMain: true,
        }, {
            where: {
                id: req.params.id
            }
        });

        res.send({ status: true })
    } catch (error) {
        res.status(500).send({ status: false, error: error.message })
    }
})

module.exports = app;
