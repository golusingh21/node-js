const Common = require('../helper/common');
const categoryModel = require('../model/categoryModel');
const categoryValidation = require("../validation/categoryValidation");

async function getAll(req, res){
    try{
        const {pageNumber = Common.pageNumber, pageSize = Common.pageSize} = req.query;
        const page = parseInt(pageNumber);
        const size = parseInt(pageSize);
        const data = await categoryModel
        .find({deleteAt: null})
        .skip((page - 1) * size)
        .limit(size)
        .exec();
        const totalRecords = await categoryModel.countDocuments({deleteAt: null});
        return res.status(200).json({
            message: 'success',
            data,
            totalRecords,
        })
    }catch(err){
        res.status(500).json({
            message: Common.INTERNAL_SERVER_ERROR
        })
    }
}

async function details(req, res){
    const {id} = req.params
    try{
        const data = await categoryModel.findById(id);
        if(data){
            return res.status(200).json({
                status: 'success',
                details: data
            })
        }
        return res.status(400).json({
            message: Common.DATA_NOT_FOUND
        })
    }catch(err){
        res.status(500).json({
            message: Common.INTERNAL_SERVER_ERROR
        })
    }
}

async function create(req, res){
    try{
        const body = req.body;
        const {error} = categoryValidation.validate(body);
        if(error){
            return res.status(400).json({
                message: Common.VALIDATION_ERROR,
                error: error
            })
        }
        const hasCategory = await categoryModel.findOne({name: body.name});
        if(hasCategory){
            return res.status(400).json({
                message: 'Category already exist'
            })
        }
        const data = await categoryModel.create({
            ...body,
            createAt: new Date(),
            updateAt: null,
            deleteAt: null
        })
        return res.status(200).json({
            data,
            message: 'Category create successfully.'
        })
    }catch(err){
        res.status(500).json({
            message: Common.INTERNAL_SERVER_ERROR
        })
    }
}

async function update(req, res){
    try{
        const {id} = req.params;
        const {name, status} = req.body;
        const {error} = await categoryValidation.validate({name, status});
        if(error){
            return res.status(400).json({
                error: Common.VALIDATION_ERROR
            })
        }
        const hasCategory = await categoryModel.findById(id);
        if(!hasCategory){
            return res.status(400).json({
                message: Common.DATA_NOT_FOUND
            })
        }
        const data = await categoryModel.findByIdAndUpdate(id, {name, status, updateAt: new Date()}, {new: true});
        return res.status(200).json({
            status: 'success',
            data
        })
    }catch(err){
        res.status(500).json({
            message: Common.INTERNAL_SERVER_ERROR
        })
    }
}

const categoryController = {
    getAll,
    details,
    create,
    update
}

module.exports = categoryController;