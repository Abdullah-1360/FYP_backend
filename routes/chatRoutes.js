const express = require('express');
const chatUpload = require('../controllers/chatController');

const router = express.Router();

// Community chat file upload
router.use('/', chatUpload);

module.exports = router; 