const jwt = require('jsonwebtoken');

module.exports = {
    authenticateUser: (req, res, next) => {
        const token = req.header('Authorization');
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

    authorizeAdmin: (req, res, next) => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Access denied. Admins only.' });
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
    }
};