const express = require('express');
const chatUpload = require('../controllers/chatController');
const { authenticateUser } = require('../middlewares/authMiddleware');
const chatService = require('../services/chatService');
const { getFullUrl } = require('../utils/helpers');

const router = express.Router();

// Community chat file upload - moved to specific route
router.use('/upload', chatUpload);

// Fetch private (doctor) chat history for the logged-in user and a specific doctor
router.get('/private/:doctorId', authenticateUser, async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const userId = req.user.id;
    const messages = await chatService.getDoctorMessages(userId, doctorId);
    // Transform messages to ensure consistent structure with frontend expectations
    const formatted = messages.map((msg) => ({
      senderId: msg.senderId?._id || msg.senderId,
      receiverId: msg.receiverId?._id || msg.receiverId,
      senderName: msg.senderId?.username || 'Unknown',
      receiverName: msg.receiverId?.name || msg.receiverId?.username || 'Unknown',
      message: msg.message || '',
      fileUrl: msg.fileUrl ? getFullUrl(msg.fileUrl, req) : null,
      fileType: msg.fileType,
      timestamp: msg.timestamp,
      _id: msg._id,
    }));
    res.json(formatted);
  } catch (err) {
    next(err);
  }
});

module.exports = router; 