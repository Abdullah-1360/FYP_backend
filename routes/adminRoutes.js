const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '..', 'uploads', 'medicines');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Route to view all users
router.get('/users', adminController.viewUsers);

// Route to block/unblock users
router.post('/users/block/:id', adminController.blockUser);
router.post('/users/unblock/:id', adminController.unblockUser);

// Route to track medicines
router.get('/medicines', adminController.trackMedicines);
router.post('/medicines', adminController.addMedicine);
router.put('/medicines/:id', adminController.updateMedicine);
router.delete('/medicines/:id', adminController.deleteMedicine);

// Route to manage doctors
router.post('/doctors', adminController.addDoctor);
router.get('/doctors', adminController.getAllDoctors);
router.delete('/users/:id', adminController.deleteUser);
router.delete('/doctors/:id', adminController.deleteDoctor);

router.post('/upload', upload.single('file'), (req, res) => {
  try {
    const filePath = `/uploads/medicines/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get('host')}${filePath}`;
    res.status(200).json({ url: fullUrl });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

module.exports = router;