const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Community chat routes
router.post('/community', chatController.sendCommunityMessage);
router.get('/community', chatController.getCommunityChat);

// Doctor chat routes
router.post('/doctor/:doctorId', chatController.sendDoctorMessage);
router.get('/doctor/:doctorId', chatController.getDoctorChat);

module.exports = router;