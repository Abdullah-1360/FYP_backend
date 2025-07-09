const Diagnosis = require('../models/Diagnosis');
const aiDiagnosisService = require('../services/aiDiagnosisService');

// Function to upload an image for diagnosis
exports.uploadImageForDiagnosis = async (req, res) => {
    try {
        const image = req.file; // Assuming you're using multer for file uploads
        if (!image) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const diagnosisResult = await aiDiagnosisService.diagnosePlant(image.path);
        res.status(200).json({ diagnosis: diagnosisResult });
    } catch (error) {
        res.status(500).json({ message: 'Error processing the image', error });
    }
};

// Function to retrieve previous diagnosis results
exports.getDiagnosisResults = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming user ID is available in req.user
        const results = await Diagnosis.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving diagnosis results', error });
    }
};