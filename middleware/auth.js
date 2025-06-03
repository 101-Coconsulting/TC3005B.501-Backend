import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid Token' });
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        res.status(401).json({ error: 'Token was not provided' });
    }
};

export const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403). json({ error: "Access denied: insuficient permissions."});
        }
        next();
    };
};