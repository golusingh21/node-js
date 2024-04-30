const productModel = require('../model/productModel');
const categoryModel = require('../model/categoryModel');
const Common = require('../helper/common');
const productValidation = require('../validation/productValidation')

async function getAll(req, res){
    try{
        const {pageNumber = Common.pageNumber, pageSize = Common.pageSize} = req.query;
        const page = parseInt(pageNumber);
        const size = parseInt(pageSize);
        const data = await productModel
        .find({deleteAt: null})
        .limit(size)
        .skip((page - 1) * size)
        .exec()
        const totalRecords = await productModel.countDocuments({deleteAt: null});
        return res.status(200).json({
            data,
            totalRecords
        })
    }catch(err){
        return res.status(500).json({
            message: Common.INTERNAL_SERVER_ERROR
        })
    }
}

async function details(req, res){
    try{
        const {id} = req.params;
        const data = await productModel.findById(id);
        if(!data){
            return res.status(400).json({
                message: Common.DATA_NOT_FOUND,
            })
        }
        const categoryData = await categoryModel.findById(data?.categoryId);
        return res.status(200).json({
            data,
            categoryName: categoryData.name
        })
    }catch(err){
        return res.status(500).json({
            message: Common.INTERNAL_SERVER_ERROR
        })
    }
}

async function create(req, res){
    try{
        const {name, status, description, categoryId} = req.body;
        const {error} = await productValidation.validate({name, status, description, categoryId});
        if(error){
            return res.status(400).json({
                message: Common.VALIDATION_ERROR,
                errors: error
            })
        }
        const hasCategory = await categoryModel.findOne({_id: categoryId});
        if(!hasCategory){
            return res.status(400).json({
                message: "Category not found"
            })
        }
        const hasProduct = await productModel.findOne({name});
        if(hasProduct){
            return res.status(400).json({
                message: 'Name already exist.'
            })
        }
        const data = await productModel.create({
            name, 
            status, 
            description, 
            categoryId,
            createAt: new Date(),
            updateAt: null,
            deleteAt: null
        });
        return res.status(200).json({
            message: 'Product created successfully.',
            data
        })
    }catch(err){
        return res.status(500).json({
            message: Common.INTERNAL_SERVER_ERROR
        })
    }
}

const productController = {
    getAll,
    details,
    create
}
module.exports = productController;