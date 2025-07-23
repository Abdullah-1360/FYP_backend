const path = require('path');
const multer = require('multer');
const express = require('express');
const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/community'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

const { getFullUrl } = require('../utils/helpers');

// File upload endpoint
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Construct file URL (assuming static serving from /uploads)
  const relativeUrl = `/uploads/community/${req.file.filename}`;
  // Get full URL using the helper function
  const fullUrl = getFullUrl(relativeUrl, req);
  
  res.status(200).json({ 
    url: fullUrl, 
    filename: req.file.originalname,
    fileType: 'image' // Add file type for better client handling
  });
});

module.exports = router;