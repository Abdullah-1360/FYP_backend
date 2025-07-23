const jwt = require('jsonwebtoken');

function verifyUserToken(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (ex) {
        return null;
    }
}

function verifyAdminToken(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    } catch (ex) {
        return null;
    }
}

module.exports = {
    authenticateUser: (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (ex) {
            res.status(400).json({ message: 'Invalid token.' });
        }
    },

    authenticateAdmin: (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
            if (!decoded.isAdmin) {
                return res.status(403).json({ message: 'Access denied. Admins only.' });
            }
            req.admin = decoded;
            next();
        } catch (ex) {
            res.status(400).json({ message: 'Invalid token.' });
        }
    },

    validateSignup: (req, res, next) => {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        next();
    },

    validateLogin: (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }
        next();
    },

    verifyUserToken,
    verifyAdminToken
};