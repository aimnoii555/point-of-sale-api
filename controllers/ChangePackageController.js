const express = require('express')
const app = express()

const { isLogin } = require('./Service')
const ChangePackageModel = require('../models/ChangePackageModel')
const PackageModel = require('../models/PackageModel')
const MemberModel = require('../models/MemberModel')
const { Op, Sequelize } = require('sequelize')
const date = require('date-and-time');




app.get('/change-package/list', isLogin, async (req, res) => {
    try {
        ChangePackageModel.belongsTo(PackageModel, {
            foreignKey: 'package_id'
        })
        ChangePackageModel.belongsTo(MemberModel, {
            foreignKey: 'user_id'
        })

        let logs = ''


        const data = await ChangePackageModel.findAll({
            order: [['id', 'desc']],
            include: [
                { model: PackageModel },
                { model: MemberModel }
            ],
            where: {
                pay_date: null,
                [Op.and]: [
                    Sequelize.literal('`package_member`.`package_id` != `member`.`package_id`')
                ]
            },

        })
        res.send({ status: true, data })
    } catch (error) {
        res.send({ status: false, error: error.message })
    }
})


app.post('/chanage-package/change', isLogin, async (req, res) => {
    try {

        await MemberModel.update({
            package_id: Number(req.body.package_id)
        }, {
            where: {
                id: req.body.user_id,
            }
        })

        const payload = {
            package_id: req.body.package_id,
            pay_date: req.body.pay_date,
            pay_hours: req.body.pay_hours,
            pay_minutes: req.body.pay_minutes,
            remark: req.body.remark,
        }
        await ChangePackageModel.update(payload, {
            where: {
                id: req.body.id,
            }
        })
        res.send({ status: true })
    } catch (error) {
        res.send({ status: false, error: error.message })
    }
})

app.post('/package/report', isLogin, async (req, res) => {
    try {

        const y = Number(req.body.years);    // เช่น 2025
        const m = Number(req.body.months);   // 1..12

        // วันนี้ (สำหรับเช็คว่าเป็นเดือนปัจจุบันไหม)
        const now = new Date();
        const thisYear = now.getFullYear();
        const thisMonth = now.getMonth() + 1; // 1..12
        const today = now.getDate();

        // จำนวนวันใน "เดือนที่ขอ"
        const daysInMonth = new Date(y, m, 0).getDate(); // m แบบ 1..12 

        // เลือกวันสิ้นสุด: ถ้าเป็นเดือนปัจจุบัน ใช้ today, ไม่งั้นใช้สิ้นเดือน
        const endDay = (y === thisYear && m === thisMonth) ? today : daysInMonth;

        // สร้างช่วงวันที่ด้วย Date 
        const start = new Date(y, m - 1, 1, 0, 0, 0, 0);                 // เริ่มต้นต้นเดือน 00:00:00
        const end = new Date(y, m - 1, endDay, 23, 59, 59, 999);       // สิ้นวันสุดท้าย 23:59:59.999

        ChangePackageModel.belongsTo(MemberModel, { foreignKey: 'user_id' });
        ChangePackageModel.belongsTo(PackageModel, { foreignKey: 'package_id' });

        let logs = '';
        const data = await ChangePackageModel.findAll({
            order: [['id', 'desc']],
            where: {
                pay_date: {
                    [Op.not]: null
                },
                createdAt: {
                    [Op.between]: [start, end],
                },
            },
            include: [
                { model: MemberModel, attributes: ['name'] },
                { model: PackageModel, attributes: ['name', 'price'] },
            ],
            logging: (msg) => { logs = msg; },
        });

        const dataItem = Array.from({ length: endDay }, (_, i) => ({
            day: i + 1,
            items: [],
            sum: 0
        }))

        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            const d = item.createdAt;
            const day = d.getDate()

            if (day >= 1 && day <= endDay) {
                const b = dataItem[day - 1];

                b.items.push(item)
                b.sum += Number(item.package.price ?? 0)
            }

        }

        res.send({ status: true, data: dataItem, logs });
    } catch (error) {
        res.send({ status: false, error: error.message });
    }
});


app.post('/package/report-month', isLogin, async (req, res) => {

    try {
        // แปลงปีให้แน่ชัด
        const year = parseInt(req.body.year);
        // วันที่เริ่มต้นและสิ้นสุดของปีนั้น (แบบ local)
        const startDate = `${year}-01-01 00:00:00`;        // local time
        const endDate = `${year}-12-31 00:00:00`;    // local time


        console.log('startDate ' + startDate)
        console.log('endDate ' + endDate)



        ChangePackageModel.belongsTo(MemberModel, { foreignKey: 'user_id' });
        ChangePackageModel.belongsTo(PackageModel, { foreignKey: 'package_id' });

        let logs = '';
        const data = await ChangePackageModel.findAll({
            order: [['id', 'desc']],
            where: {
                pay_date: { [Op.not]: null },
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [
                { model: MemberModel, attributes: ['name'] },
                { model: PackageModel, attributes: ['name', 'price'] }
            ],
            logging: (msg) => { logs = msg; }
        });

        // เตรียม array 12 เดือน
        const dataItem = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            items: [],
            sum: 0
        }));

        // รวมข้อมูลรายเดือน
        for (const item of data) {
            const date = new Date(item.createdAt)
            const month = (date.getMonth() + 1);
            const bucket = dataItem[month - 1];
            bucket.items.push(item);
            bucket.sum += Number(item.package?.price ?? 0);
        }

        res.send({ status: true, data: dataItem, logs, range: { startDate, endDate } });
    } catch (error) {
        console.error(error);
        res.send({ status: false, error: error.message });
    }
});

app.get('/package/report-year', isLogin, async (req, res) => {
    try {
        const myDate = new Date()
        const year = myDate.getFullYear()
        const startYear = (year - 10)

        const startDate = new Date(startYear, 0, 1, 0, 0, 0); // 1 Jan startYear
        const endDate = new Date(year, 11, 31, 23, 59, 59);   // 31 Dec currentYear

        ChangePackageModel.belongsTo(MemberModel, { foreignKey: 'user_id' });
        ChangePackageModel.belongsTo(PackageModel, { foreignKey: 'package_id' });

        let logs = '';
        const data = await ChangePackageModel.findAll({
            order: [['id', 'desc']],
            where: {
                pay_date: { [Op.not]: null },
                createdAt: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [
                { model: MemberModel, attributes: ['name'] },
                { model: PackageModel, attributes: ['name', 'price'] }
            ],
            logging: (msg) => { logs = msg; }
        });

        const dataItem = Array.from({ length: 11 }, (_, i) => ({
            years: startYear + i,
            items: [],
            sum: 0
        }));

        // รวมข้อมูลรายเดือน
        for (const item of data) {
            const date = new Date(item.createdAt)
            const y = date.getFullYear();
            const idx = y - startYear;

            if (idx >= 0 && idx < dataItem.length) {
                dataItem[idx].items.push(item);
                dataItem[idx].sum += Number(item.package?.price ?? 0);
            }

        }

        res.send({ status: true, data: dataItem, logs });
    } catch (error) {
        res.send({ status: false, error: error.message });
    }
})

module.exports = app;
