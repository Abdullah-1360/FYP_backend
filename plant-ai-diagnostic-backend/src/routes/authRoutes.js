const express = require('express');
const { signup, login } = require('../controllers/authController');
const { validateSignup, validateLogin } = require('../middlewares/authMiddleware');

const router = express.Router();

// User signup route
router.post('/signup', validateSignup, signup);

// User login route
router.post('/login', validateLogin, login);

module.exports = router;