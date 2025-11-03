const express = require('express');
const { isLogin, getMemberId } = require('./Service');
const StockModel = require('../models/StockModel')
const app = express()

const ProductModel = require('../models/ProductModel')
const BillSaleDetailModel = require('../models/BillSaleDetailModel')


app.post('/stock/save', isLogin, async (req, res) => {
    try {
        let payload = {
            qty: req.body.qty,
            product_id: req.body.product_id,
            user_id: await getMemberId(req)
        }
        await StockModel.create(payload)
        res.send({ status: true })
    } catch (error) {
        res.send({ status: false, error: error.message })
    }
})

app.get('/stock/list', isLogin, async (req, res) => {

    try {
        StockModel.belongsTo(ProductModel, {
            foreignKey: 'product_id'
        })
        const data = await StockModel.findAll({
            where: {
                user_id: await getMemberId(req)
            },
            order: [['id', 'desc']],
            include: {
                model: ProductModel
            }
        })
        res.send({ status: true, data })
    } catch (error) {
        res.send({ status: false, error: error.message })

    }
})

app.delete('/stock/delete/:id', isLogin, async (req, res) => {
    try {
        await StockModel.destroy({
            where: {
                id: req.params.id,
                user_id: await getMemberId(req)
            }
        })
        res.send({ status: true })
    } catch (error) {
        res.send({ status: false, error: error.message })

    }
})

app.get('/stock/report', isLogin, async (req, res) => {
    try {

        ProductModel.hasMany(StockModel, { foreignKey: 'product_id' })
        ProductModel.hasMany(BillSaleDetailModel, { foreignKey: 'product_id' })
        StockModel.belongsTo(ProductModel, {
            foreignKey: 'product_id'
        })

        BillSaleDetailModel.belongsTo(ProductModel, {
            foreignKey: 'product_id'
        })

        let arr = []

        const data = await ProductModel.findAll({
            include: [
                {
                    model: StockModel,
                    include: [
                        { model: ProductModel }
                    ]
                },
                { model: BillSaleDetailModel, include: [{ model: ProductModel }] },

            ],
            where: {
                user_id: await getMemberId(req)
            }
        })

        for (let i = 0; i < data.length; i++) {
            const result = data[i];
            const stockQty = result.stocks
            const billSaleDetails = result.bill_sale_details;

            let stockIn = 0;
            let stockOut = 0;

            for (let j = 0; j < stockQty.length; j++) {
                const item = stockQty[j]
                stockIn += Number(item.qty)
            }

            for (let k = 0; k < billSaleDetails.length; k++) {
                const item = billSaleDetails[k]
                stockOut += Number(item.qty)
            }

            arr.push({
                result,
                stock_in: stockIn,
                stock_out: stockOut
            })
        }

        res.send({ status: true, data: arr })
    } catch (error) {
        res.send({ status: false, error: error.message })
    }
})


module.exports = app;
