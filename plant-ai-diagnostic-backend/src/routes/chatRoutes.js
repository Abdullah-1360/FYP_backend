const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Community chat routes
router.post('/community', chatController.sendCommunityMessage);
router.get('/community', chatController.getCommunityMessages);

// Doctor chat routes
router.post('/doctor/:doctorId', chatController.sendDoctorMessage);
router.get('/doctor/:doctorId', chatController.getDoctorMessages);

module.exports = router;