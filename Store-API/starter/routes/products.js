const express = require('express')
const router = express.Router()

const {createProduct,getProductsById,getAllProducts,getAllProductsStatic,updateProduct,deleteProduct} = require('../controllers/products')

router.route('/').get(getAllProducts).post(createProduct)
router.route('/:id').get(getProductsById).patch(updateProduct).delete(deleteProduct)
router.route('/static').get(getAllProductsStatic)

module.exports = router