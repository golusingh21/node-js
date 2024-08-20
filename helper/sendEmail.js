const nodeMailer = require('nodemailer');
const forgotPasswordTemplate = require('../mailTemplate/forgotPassword');
const Common = require('./common');

async function _renderTemplate(user, type, link){
    switch(type){
        case Common.TEMPLATE.RESET_PASSWORD: return await forgotPasswordTemplate(user, link)
    }
}

async function sendEmail(user, type, link){
    try{
        const html = await _renderTemplate(user, type, link)
        const transport = nodeMailer.createTransport({
            host: 'smtp.email',
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_EMAIL_PASSWORD
            },
        })
        transport.sendMail({
            from: process.env.USER_EMAIL,
            to: user.email,
            subject: type,
            html: html
        })
        return true
    }catch(error){
        console.log(33, error)
        return null
    }
}
module.exports = sendEmail;