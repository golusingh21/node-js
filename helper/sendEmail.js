const nodeMailer = require('nodemailer');

async function sendEmail(email, subject, body){
    try{
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
            to: email,
            subject: subject,
            text: body
        })
        return true
    }catch(error){
        console.log(33, error)
        return null
    }
}
module.exports = sendEmail;