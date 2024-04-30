const jwt = require('jsonwebtoken');

// function authMiddleware(req, res, next){
//     const {authorization} = req.headers
//     console.log(555, authorization)
//     res.setHeader("Content-Type", "application/json");
//     if(!authorization){
//         return res.status(401).json({
//             message: 'unauthorized'
//         })
//     }
//     try{
//         const decodeAuthorization = jwt.verify(authorization, process.env.JWT_SECRET_KEY);
//         req.user = decodeAuthorization;
//     }catch(err){
//         return res.status(401).json({
//             message: 'unauthorized'
//         })
//     }
//     next()
// }

function authMiddleware(req, res, next) {
    const { authorization } = req.headers;
    res.setHeader("Content-Type", "application/json");
    
    if (!authorization) {
        return res.status(401).json({
            message: 'unauthorized'
        });
    }
    
    try {
        const decodeAuthorization = jwt.verify(authorization, process.env.JWT_SECRET_KEY);
        req.user = decodeAuthorization;
        next(); // Call next middleware or route handler
    } catch(err) {
        return res.status(401).json({
            message: 'unauthorized'
        });
    }
}

module.exports = {
    authMiddleware
}