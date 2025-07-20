// authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middlewares/authMiddleware');

const router = express.Router();

// User signup route
router.post('/signup', validateSignup, authController.signup);

// User login route
router.post('/login', validateLogin, authController.login);

// Token validation route
router.get('/validate', authController.validateToken);

module.exports = router;