const userModel = require('../model/usreModel');
const userValidation = require('../validation/userValidation')
const Common = require("../helper/common")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const {OAuth2Client} = require('google-auth-library')

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function googleLogin(req, res){
    const {idToken} = req.body;
    if(!idToken){
        res.status(400).json({
            error: "Id token is required"
        })
    }
    try{
        const tokenVerification = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        })
        const payload = tokenVerification.getPayload();
        let user = await userModel.findOne({googleId: payload.sub});
        if(!user){
            user = new userModel({
                googleId: payload.sub,
                name: payload.name,
                email: payload.email
            })
           await user.save()
        }
        const token = jwt.sign({id: payload.sub, email: payload.email}, process.env.JWT_SECRET_KEY, {expiresIn: '2h'})
        return res.status(200).json({
            message: 'success',
            data: {
                token,
                email: payload.email,
                name: payload.name
            }
        })
    }catch(error){
        console.log('error-->', error)
        return res.status(500).json({
            error: 'Internal server error',
            message: error
        })
    }
}

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
            const token = jwt.sign({id: hasUser._id, email: hasUser.email}, process.env.JWT_SECRET_KEY, {expiresIn: '2h'})
            return res.status(200).json({
                message: 'success',
                data: {
                    token,
                    email: hasUser.email,
                    name: hasUser.name
                }
            })
        }else{
            return res.status(400).json({
                message: 'Invalid credentials'
            })
        }
        
    }catch(err){
        return res.status(500).json({
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
        return res.status(200).json({
            message: 'success',
            data,
            totalRecords
        })
    }catch(err){
        return res.status(500).json({
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
        return res.status(500).json({
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
        return res.status(500).json({
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
        return res.status(500).json({
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
            return res.status(200).json({
                message: 'User deleted successfully'
            })
        }
        return res.status(400).json({
            message: 'Data not found'
        })
    }catch(err){
        return res.status(500).json({
            error: 'Internal server error'
        })
    }
}

const userController = {
    googleLogin,
    loginUser,
    getAll,
    details,
    create,
    update,
    destroy
}
module.exports = userController;