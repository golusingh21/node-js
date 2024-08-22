const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const { authorization } = req.headers;
    res.setHeader("Content-Type", "application/json");
    
    if (!authorization) {
        return res.status(401).json({
            message: 'unauthorized'
        });
    }
    
    try {
        const newAuthToken = authorization.replace("Bearer ", "")
        const decodeAuthorization = jwt.verify(newAuthToken, process.env.JWT_SECRET_KEY);
        req.user = decodeAuthorization;
        return next(); // Call next middleware or route handler
    } catch(err) {
        return res.status(401).json({
            message: 'unauthorized'
        });
    }
}

module.exports = {
    authMiddleware
}