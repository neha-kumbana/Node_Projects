const Product = require('../models/product')

const createProduct =  async (req, res) => {
    const product = await Product.create(req.body)
    res.status(201).json({product})
}

const getAllProductsStatic = async (req,res) => {
    const products = await Product.find({featured:true})
    res.status(200).json({products, nbHits: products.length})
}

const getAllProducts = async (req,res) => {
    const products = await Product.find({})
    res.status(200).json({products})
}

const getProductsById = async (req,res) => {
    const {id:productID} = req.params
    const product = await Product.findOne({_id:productID})
    if(!product){
        return res.status(404).json({msg:`No product with ${productID} id`})
    }
    res.status(200).json({product})
}

const updateProduct = async (req,res) => {
    const {id:productID} = req.params
    const product = await Product.findOneAndUpdate({_id:productID},req.body,{
        new:true,runValidators:true,
    })
    if(!product){
        return res.status(404).json({msg:`No product with ${productID} id`})
    }
    res.status(200).json({product})
}

const deleteProduct = async (req,res) => {
    const {id:productID} = req.params
    const product = await Product.deleteOne({_id:productID})
    if(!product){
        return res.status(404).json({msg:`No product with ${productID} id`})
    }
    res.status(200).json({product:null,statusbar:'success'})
}

module.exports = {
        createProduct,
        getAllProductsStatic,
        getAllProducts,
        getProductsById,
        updateProduct,
        deleteProduct
    }