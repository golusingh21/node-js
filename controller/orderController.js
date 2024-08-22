const Common = require('../helper/common');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function productPayment(req, res){
    const {amount, productId, token} = req.body
    const {user} = req; 
    try{
        const payment = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            source: token,
        })
        console.log(44, payment);
        return res.status(200).json({
            data: payment
        })
    }catch(error){
        return res.status(500).json({
            message: Common.INTERNAL_SERVER_ERROR,
            error: error
        })
    }
}

const orderController = {
    productPayment,
}
module.exports = orderController;