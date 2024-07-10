const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader?.split(' ')[1] || req?.cookies?.token;
    if (!token) {
        return res.status(403).send({ message: 'No token provided!' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).send({ message: 'Token expired!' });
            }
            return res.status(401).send({ message: 'Unauthorized!' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;
