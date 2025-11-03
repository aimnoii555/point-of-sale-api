const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

const PackageController = require('./controllers/PackageController')
const MemberController = require('./controllers/MemberController')
const ProductController = require('./controllers/ProductController')
const ProductImageController = require('./controllers/ProductImageController')
const UserController = require('./controllers/UserController')
const BillSaleController = require('./controllers/BillSaleController')
const StockController = require('./controllers/StockController')
const BankController = require('./controllers/BankController')

const AdminController = require('./controllers/AdminController')
const ChangePackageController = require('./controllers/ChangePackageController')


const app = express()
const port = 3000;

dotenv.config()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))


app.use(PackageController)
app.use(MemberController)
app.use(ProductController)
app.use(ProductImageController)
app.use(UserController)
app.use(BillSaleController)
app.use(StockController)
app.use(BankController)

app.use(AdminController)
app.use(ChangePackageController)


app.listen(port, () => {
    console.log('Server is running port ' + port)
})
