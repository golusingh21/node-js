const userModel = require('../model/usreModel');
const userValidation = require('../validation/userValidation')
const Common = require("../helper/common")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');

async function loginUser(req, res){
    const {email, password} = req.body;
    try{
        const hasUser = await userModel.findOne({email});
        if(!hasUser){
            return res.status(400).json({
                message: 'Invalid credentials'
            })
        }
        const passwordMatch = await bcrypt.compare(password, hasUser.password)
        if(passwordMatch){
            const token = jwt.sign({id: hasUser._id, email: hasUser.email}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'})
            return res.status(200).json({
                message: 'success',
                data: {
                    token,
                    email: hasUser.email,
                    name: hasUser.name
                }
            })
        }else{
            res.status(400).json({
                message: 'Invalid credentials'
            })
        }
        
    }catch(err){
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}

async function getAll(req, res){
    try{
        const {pageNumber = Common.pageNumber, pageSize = Common.pageSize} = req.query;
        const page = parseInt(pageNumber);
        const size = parseInt(pageSize);
        const data = await userModel
        .find()
        .skip((page - 1) * size)
        .limit(size)
        .exec()
        const totalRecords = await userModel.countDocuments();
        res.status(200).json({
            message: 'success',
            data,
            totalRecords
        })
    }catch(err){
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}

async function details(req, res){
    const {id} = req.params
    try{
        const data = await userModel.findOne(id)
        if(data){
            return res.status(200).json({
                message: 'success',
                data
            })
        }else{
            return res.status(200).json({
                message: 'Data not found'
            })
        }
        
    }catch(err){
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}

async function create(req, res){
    const {body} = req;
    const {password} = body
    const encryptPassword = await bcrypt.hash(password, 10)
    const {error} = await userValidation.validate(body);
    if(error) res.status(400).json({
        message: 'validation error',
        error: error
    })
    try{
        const hasUser = await userModel.findOne({email: body.email});
        if(hasUser){
            return res.status(400).json({
                message: `User already exist with ${body.email}`
            })
        }
        const data = await userModel.create({...body, password: encryptPassword});
        return res.status(200).json({
            data: data,
            message: 'User created successfully'
        })
    }catch(err){
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}

async function update(req, res){
    const {body} = req;
    const {id} = req.params
    const {password} = body
    const encryptPassword = await Common.cryptoEncript(password)
    const {error} = await userValidation.validate(body);
    if(error) res.status(400).json({
        message: 'validation error',
        error: error
    })
    try{
        const hasUser = await userModel.findById(id);
        if(!hasUser){
            return res.status(400).json({
                message: `User not found`
            })
        }
        const data = await userModel.findByIdAndUpdate(id, {...body, password: encryptPassword}, {new: true});
        return res.status(200).json({
            data: data,
            message: 'User updated successfully'
        })
    }catch(err){
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}

async function destroy(req, res){
    const {id} = req.params;
    try{
        const hasData = await userModel.findById(id)
        if(hasData){
            await userModel.findByIdAndDelete(id);
            res.status(200).json({
                message: 'User deleted successfully'
            })
        }
        return res.status(400).json({
            message: 'Data not found'
        })
    }catch(err){
        res.status(500).json({
            error: 'Internal server error'
        })
    }
}

const userController = {
    loginUser,
    getAll,
    details,
    create,
    update,
    destroy
}
module.exports = userController;