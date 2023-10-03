const Product = require('../models/product')

const createProduct =  async (req, res) => {
    const product = await Product.create(req.body)
    res.status(201).json({product})
}

const getAllProductsStatic = async (req,res) => {
    const products = await Product.find({company:ikea})
    res.status(200).json({products, nbHits: products.length})
}

const getAllProducts = async (req,res) => {
    const { featured, company, name, sort, fields, numericFilters } = req.query
    const queryObject = {}
    if(featured){
        queryObject.featured = featured === 'true' ? true : false
    }
    if(company){
        queryObject.company = company
    }
    if(name){
        queryObject.name = { $regex: name, $options: 'i'}
    }
    if(numericFilters){
        const operatorMap = {
            '>':'$gt',
            '>=':'$gte',
            '=':'$eq',
            '<':'$lt',
            '<=':'$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(regEx,(match) => `-${operatorMap[match]}-`) 
        const options = ['price','rating']
        filters = filters.split(',').forEach((item) => {
            const [field,operator,value] = item.split('-')
            if(options.includes(field)){
                queryObject[field] = {[operator]:Number(value)}
            }
        })
    }
    // console.log(queryObject);
    let result = Product.find(queryObject)
    if(sort){
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }
    else{
        result = result.sort('createdAt')
    }

    if(fields){
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1) * limit
    result = result.skip(skip).limit(limit)


    const products = await result
    res.status(200).json({products, nbHits:products.length})
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