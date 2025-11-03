const express = require('express');
const { isLogin, getMemberId } = require('./Service');
const BillSaleModel = require('../models/BillSaleModel');
const BillSaleDetailModel = require('../models/BillSaleDetailModel');
const ProdcutModel = require('../models/ProductModel');
const ProductImageModel = require('../models/ProductImageModel');
const { Op } = require('sequelize');
const app = express();


app.get('/bill/open-bill', isLogin, async (req, res) => {
    try {
        const userId = await getMemberId(req);
        const payload = { user_id: userId, status: 'open' }

        const billCheck = await BillSaleModel.findOne({ where: payload })
        if (!billCheck) {
            const bill = await BillSaleModel.create(payload)
            return res.send({ status: true, data: bill })
        }
        return res.send({ status: false, data: null })
    } catch (error) {
        res.send({ status: false, error: error.message })
    }
})

app.post('/bill/sale', isLogin, async (req, res) => {
    try {


        const where = { user_id: await getMemberId(req), status: 'open' }
        const currentBill = await BillSaleModel.findOne({
            where: where
        })

        if (currentBill) {
            const items = {
                price: req.body.price,
                product_id: req.body.id,
                bill_sale_id: currentBill.id,
                user_id: where.user_id
            }
            const billSaleDetail = await BillSaleDetailModel.findOne({
                where: items
            })
            if (!billSaleDetail) {
                items.qty = 1;
                await BillSaleDetailModel.create(items)
            } else {
                items.qty = billSaleDetail.qty + 1;
                await BillSaleDetailModel.update(items, {
                    where: {
                        id: billSaleDetail.id
                    }
                })
            }

            return res.send({ status: true })
        }
        res.send({ status: false })
    } catch (error) {
        res.send({ status: false, error: error.message })

    }
})


app.get('/bill/current-bill', isLogin, async (req, res) => {
    try {
        BillSaleModel.hasMany(BillSaleDetailModel, {
            foreignKey: 'bill_sale_id'
        })
        BillSaleDetailModel.belongsTo(ProdcutModel, {
            foreignKey: 'product_id'
        })
        ProdcutModel.hasMany(ProductImageModel, {
            foreignKey: 'product_id',
            isMain: true
        })


        const where = { user_id: await getMemberId(req), status: 'open' }
        const data = await BillSaleModel.findOne({
            where: where,
            separate: true,
            include: {
                model: BillSaleDetailModel,
                order: [['id', 'desc']],
                include: {
                    model: ProdcutModel,
                    attributes: ['id', 'name'],
                    include: {
                        model: ProductImageModel,
                        attributes: ['image_path'],
                        where: { isMain: true },
                        required: false,           // ไม่มี main image ก็ยังคืน product ได้
                        limit: 1

                    }
                }
            },
        })

        res.send({ status: true, data })

    } catch (error) {
        res.send({ status: false, error: error.message })

    }
})

app.delete('/bill/delete/:id', isLogin, async (req, res) => {
    try {

        await BillSaleDetailModel.destroy({
            where: {
                id: req.params.id
            }
        })
        res.send({ status: true })
    } catch (error) {
        res.send({ status: false, error: error.message })

    }
})

app.put('/bill/update-qty', isLogin, async (req, res) => {
    try {
        await BillSaleDetailModel.update({ qty: req.body.qty }, {
            where: {
                id: req.body.id
            }
        })
        res.send({ status: true })
    } catch (error) {
        res.send({ status: false, error: error.message })

    }
})

app.get('/bill/end-sale', isLogin, async (req, res) => {
    try {
        await BillSaleModel.update({
            status: 'paid',
        },
            {
                where: {
                    status: 'open',
                    user_id: await getMemberId(req)
                }
            })

        res.send({ status: true })
    } catch (error) {
        res.send({ status: false, error: error.message })

    }
})

app.get('/bill/last-bill', isLogin, async (req, res) => {
    try {
        BillSaleModel.hasMany(BillSaleDetailModel, {
            foreignKey: 'bill_sale_id'
        })
        BillSaleDetailModel.belongsTo(ProdcutModel, {
            foreignKey: 'product_id'
        })

        const data = await BillSaleModel.findOne({
            where: {
                status: 'paid',
                user_id: await getMemberId(req)
            },
            order: [['id', 'desc']],
            include: {
                model: BillSaleDetailModel,
                attributes: ['qty', 'price'],
                include: {
                    model: ProdcutModel,
                    attributes: ['barcode', 'name']
                }
            }
        })
        res.send({ status: true, data })

    } catch (error) {
        res.send({ status: false, error: error.message })

    }
})

app.get('/bill/bill-today', isLogin, async (req, res) => {
    try {
        BillSaleModel.hasMany(BillSaleDetailModel, {
            foreignKey: 'bill_sale_id'
        })
        BillSaleDetailModel.belongsTo(ProdcutModel, {
            foreignKey: 'product_id'
        })


        const startDate = new Date()
        startDate.setHours(0, 0, 0, 0)
        const now = new Date()
        now.setHours(24, 59, 59, 59)


        const data = await BillSaleModel.findAll({
            where: {
                status: 'paid',
                user_id: await getMemberId(req),
                createdAt: {
                    [Op.between]: [startDate.toISOString(), now.toISOString()]
                }
            },
            order: [['id', 'desc']],
            include: {
                model: BillSaleDetailModel,
                attributes: ['qty', 'price'],
                include: {
                    model: ProdcutModel,
                    attributes: ['barcode', 'name']
                }
            }
        })
        res.send({ status: true, data })
    } catch (error) {
        res.send({ status: false, error: error.message })

    }
})


app.get('/bill/list', isLogin, async (req, res) => {
    try {

        BillSaleModel.hasMany(BillSaleDetailModel, {
            foreignKey: 'bill_sale_id'
        })

        BillSaleDetailModel.belongsTo(ProdcutModel, {
            foreignKey: 'product_id'
        })

        const data = await BillSaleModel.findAll({
            where: {
                user_id: await getMemberId(req),
                status: 'paid'
            },
            order: [['id', 'desc']],
            include: {
                model: BillSaleDetailModel,
                include: {
                    model: ProdcutModel
                }
            }
        })
        res.send({ status: true, data })
    } catch (error) {
        res.send({ status: false, error: error.message })

    }
})

app.get('/bill/list-by-year-and-month/:year/:month', isLogin, async (req, res) => {
    try {
        let logs = '';
        let arr = []
        let y = req.params.year
        let m = req.params.month
        let daysInMonth = new Date(y, m, 0).getDate()

        BillSaleModel.hasMany(BillSaleDetailModel, {
            foreignKey: 'bill_sale_id'
        })

        BillSaleDetailModel.belongsTo(ProdcutModel, {
            foreignKey: 'product_id'
        })

        for (let i = 1; i <= daysInMonth; i++) {
            const start = new Date(y, m - 1, i)
            const end = new Date(y, m - 1, i + 1)

            const data = await BillSaleModel.findAll({
                where: {
                    user_id: await getMemberId(req),
                    createdAt: {
                        [Op.gte]: start,
                        [Op.lt]: end
                    }
                },
                include: {
                    model: BillSaleDetailModel,
                    include: {
                        model: ProdcutModel
                    }
                },
                logging: (msg) => {
                    logs = msg
                }
            });

            let sum = 0;
            for (let index = 0; index < data.length; index++) {
                const result = data[index]

                for (let index2 = 0; index2 < result.bill_sale_details.length; index2++) {
                    const item = result.bill_sale_details[index2];

                    sum += (Number(item.qty) * Number(item.price))

                }

            }

            arr.push({
                day: i,
                data,
                sum
            })
        }
        res.send({ status: true, data: arr, logs })
    } catch (error) {
        res.send({ status: false, error: error.message })

    }
})

module.exports = app;
