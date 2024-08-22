const userModel = require('../model/usreModel');
const tokenModel = require('../model/tokenModel')
const userValidation = require('../validation/userValidation')
const Common = require("../helper/common")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const {OAuth2Client} = require('google-auth-library');
const Joi = require('joi');
const sendEmail = require('../helper/sendEmail');

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
        return res.status(500).json({
            error: 'Internal server error'
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
        if(hasUser.isEmailVerified!==true){
            return res.status(400).json({
                message: "Email is not verified"
            })
        }
        const passwordMatch = await bcrypt.compare(password, hasUser.password)
        if(passwordMatch){
            const token = jwt.sign({id: hasUser._id, email: hasUser.email}, process.env.JWT_SECRET_KEY, {expiresIn: '300h'})
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
        let list = []
        const data = await userModel
        .find()
        .skip((page - 1) * size)
        .limit(size)
        .exec()
        data.forEach((user)=>{
            list.push({
                id: user._id,
                name: user.name,
                email: user.email,
                isEmailVerified: user.isEmailVerified
            })
        })
        const totalRecords = await userModel.countDocuments();
        return res.status(200).json({
            message: 'success',
            data: list,
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
        const user = await userModel.findById(id)
        if(user){
            return res.status(200).json({
                message: 'success',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    isEmailVerified: user.isEmailVerified
                }
            })
        }else{
            return res.status(200).json({
                message: 'user not found'
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
    const {name, email, password} = body
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
        const data = await userModel.create({
            name: name,
            email: email, 
            password: encryptPassword, 
        });
        const tokenData = await new tokenModel({
            userId: data._id,
            token: crypto.randomBytes(32).toString("hex")
        }).save()
        return res.status(200).json({
            data: {
                id: data._id,
                name: data.name,
                email: data.email,
                emailVerificationTOken: tokenData.token
            },
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

async function forgotPassword(req, res){
    const body = req.body;
    try{
        const validationSchema = Joi.object({
            email: Joi.string().email().required()
        })
        const {error} = validationSchema.validate(body);
        if(error){
            return res.status(400).json({
                message:'Validation Error',
                error: error.details[0].message
            })
        }
        const hasUser = await userModel.findOne({email: body.email, googleId: {$exists: false}});
        if(!hasUser){
            return res.status(400).json({
                message: 'User with given email does not exist'
            })
        }
        if(!hasUser.isEmailVerified){
            return res.status(400).json({
                message: 'Email is not verified'
            })
        }
        let token = await tokenModel.findOne({userId: hasUser._id});
        if(!token){
            token = await new tokenModel({
                userId: hasUser._id,
                token: crypto.randomBytes(32).toString("hex")
            }).save()
        }
        const link = `${process.env.RESET_PASSWORD_REDIRECTION_PATH}/auth/reset-password/${hasUser._id}/${token.token}`;
        const sendEmailResult = await sendEmail(hasUser, Common.TEMPLATE.RESET_PASSWORD, link);
        if(sendEmailResult){
            return res.status(200).json({
                message: "Password reset link has been sent to your account"
            })
        }else{
            return res.status(400).json({
                message: "Internal server error"
            })
        }
    }catch(error){
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}

async function resetPassword(req, res){
    const {userId, token, password} = req.body;
    try{
        const validationSchema = Joi.object({password: Joi.string().required()});
        const {error} = validationSchema.validate({password: password});
        if(error){
            return res.status(400).json({
                message:'Validation Error',
                error: error.details[0].message
            })
        }
        const hasUser = await userModel.findById(userId);
        if(!hasUser){
            return res.status(400).json({
                message: "Invalid link or expired"
            })
        }
        const hasToken = await tokenModel.findOne({
            userId: hasUser._id,
            token: token
        })
        if(!hasToken){
            return res.status(400).json({
                message: "Invalid link or expired"
            })
        }
        const encryptPassword = await bcrypt.hash(password, 10)
        hasUser.password = encryptPassword;
        await hasUser.save();
        await tokenModel.deleteOne();
        return res.status(200).json({
            message: "Password reset successfully."
        })
    }catch(error){
        return res.status(500).json({
            message: 'Internal server error',
            error
        })
    }
}

async function emailVerification(req, res){
    const {token, userId} = req.query
    try{
        const user = await userModel.findOne({_id: userId, isEmailVerified: false})
        if(!user){
            return res.status(400).json({
                message: "Invalid link or expired"
            })
        }
        const hasToken = tokenModel.findOne({userId: userId, token: token})
        if(!hasToken){
            return res.status(400).json({
                message: "Invalid ilnk or expired"
            })
        }
        user.isEmailVerified = true;
        await user.save();
        await tokenModel.deleteOne();
        return res.status(200).json({
            message: "Email verified successfully"
        })
    }catch(error){
        return res.status(500).json({
            message: 'Internal server error',
            error
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
    destroy,
    forgotPassword,
    resetPassword,
    emailVerification
}
module.exports = userController;