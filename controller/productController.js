const productModel = require('../model/productModel');
const categoryModel = require('../model/categoryModel');
const Common = require('../helper/common');
const productValidation = require('../validation/productValidation');
const userModel = require('../model/usreModel');

async function getAll(req, res){
    try{
        const {user} = req;
        const {pageNumber = Common.pageNumber, pageSize = Common.pageSize} = req.query;
        const page = parseInt(pageNumber);
        const size = parseInt(pageSize);
        const data = await productModel
        .findOne({userId: user.id})
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
        const {user} = req;
        const product = await productModel.findOne({_id: id, userId: user.id});
        if(!product){
            return res.status(400).json({
                message: Common.DATA_NOT_FOUND,
            })
        }
        const categoryData = await categoryModel.findById(product?.categoryId);
        return res.status(200).json({
            data: {
                id: product.id,
                name: product.name,
                status: product.status,
                description: product.description,
                image: {
                    name: product.fileName,
                    path: `/uploads/${product.fileName}`
                },
                fileName: product.fileName,
                createAt: product.createAt,
                updateAt: product.updateAt,
                category: {
                    name: categoryData.name,
                    id: categoryData.id
                }
            }
        })
    }catch(err){
        return res.status(500).json({
            message: Common.INTERNAL_SERVER_ERROR,
            error: err
        })
    }
}

async function create(req, res){
    try{
        const {user} = req;
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
        let file = {
            fileName: "",
            filePath: "",
        }
        if(req?.file){
            file = {
                fileName: req.file.filename,
                filePath: `/uploads/${req.file.filename}`,
            }
        }
        const data = await productModel.create({
            userId: user.id,
            name, 
            status, 
            description, 
            categoryId,
            ...file,
            createAt: new Date(),
            updateAt: null,
            deleteAt: null
        });
        return res.status(200).json({
            message: 'Product created successfully.',
        })
    }catch(err){
        return res.status(500).json({
            message: Common.INTERNAL_SERVER_ERROR,
            error: err
        })
    }
}

async function update(req, res){
    try{
        const {id} = req.params;
        const {user, file} = req;
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
        let image = {
            fileName: "",
            filePath: ""
        }
        if(file?.fileName){
            image = {
                fileName: file.filename,
                filePath: `/uploads/${req.file.filename}`,
            }
        }
        const product = await productModel.findByIdAndUpdate({userId: user.id, _id: id}, {
            name,
            status,
            description,
            categoryId,
            ...image
        }, {new: true})
        if(product){
            return res.status(200).json({
                message: "Product updated successfully",
                data: product
            })
        }
        if(!product){
            return res.status(400).json({
                message: "Product not found"
            })
        }
    }catch(error){
        return res.status(500).json({
            message: Common.INTERNAL_SERVER_ERROR,
            error: error
        })
    }
}

async function destory(req, res){
    const {id} = req.params;
    const {user} = req;
    try{
        const product = await productModel.findByIdAndDelete({_id: id, userId: user.id});
        if(!product){
            return res.status(400).json({
                message: "Product nod found"
            })
        }
        return res.status(200).json({
            message: "Product deleted successfully"
        })
    }catch(error){
        return res.status(500).json({
            message: Common.INTERNAL_SERVER_ERROR,
            error: error
        })
    }
}

const productController = {
    getAll,
    details,
    create,
    update,
    destory
}
module.exports = productController;