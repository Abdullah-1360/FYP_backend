const express = require('express');
const router = express.Router();
const diagnosisController = require('../controllers/diagnosisController');

// Route for uploading a plant image for diagnosis
router.post('/upload', diagnosisController.uploadImage);

// Route for retrieving diagnosis results
router.get('/result/:id', diagnosisController.getDiagnosisResult);

module.exports = router;