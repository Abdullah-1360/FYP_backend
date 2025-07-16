const Diagnosis = require('../models/Diagnosis');
const aiDiagnosisService = require('../services/aiDiagnosisService');

// Function to upload an image for diagnosis
exports.uploadImage = async (req, res) => {
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

// Function to retrieve a specific diagnosis result by ID
exports.getDiagnosisResult = async (req, res) => {
    try {
        const diagnosis = await Diagnosis.findById(req.params.id);
        if (!diagnosis) {
            return res.status(404).json({ message: 'Diagnosis result not found' });
        }
        res.status(200).json(diagnosis);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving diagnosis result', error });
    }
};