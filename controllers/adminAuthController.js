const jwt = require('jsonwebtoken');

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        const token = jwt.sign(
            { isAdmin: true },
            process.env.ADMIN_JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.status(200).json({
            token,
            admin: {
                email: process.env.ADMIN_EMAIL
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error during admin login', error: error.message });
    }
};

exports.validateAdminToken = (req, res) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ valid: false, message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
        if (!decoded.isAdmin) {
            return res.status(401).json({ valid: false, message: 'Not an admin token' });
        }
        return res.status(200).json({ valid: true });
    } catch (err) {
        return res.status(401).json({ valid: false, message: 'Invalid or expired token' });
    }
}; 