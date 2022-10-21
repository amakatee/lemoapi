const express = require('express')
const router = express.Router()
const productsController = require('../controllers/productsController')
// const verifyJWT = require('../middlewear/verifyJWT')
// router.use(verifyJWT)

router.route('/')
    .get(productsController.getAllProducts)
    .post(productsController.createProduct)
    .patch(productsController.updateProduct)
    .delete(productsController.deleteProduct)

module.exports = router    
