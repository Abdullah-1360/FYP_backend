const mongoose = require('mongoose');
const Diagnosis = require('../models/Diagnosis');

// Function to diagnose a plant using an image
const diagnosePlant = async (image) => {
    try {
        // Here you would integrate with an AI model or service to analyze the image
        // For demonstration, let's assume we have a mock function `analyzeImage`
        const diagnosisResult = await analyzeImage(image);
        
        // Save the diagnosis result to the database
        const newDiagnosis = new Diagnosis({
            image,
            result: diagnosisResult,
            createdAt: new Date(),
        });

        await newDiagnosis.save();
        return newDiagnosis;
    } catch (error) {
        throw new Error('Error diagnosing plant: ' + error.message);
    }
};

// Mock function to simulate image analysis
const analyzeImage = async (image) => {
    // Simulate some analysis logic
    return {
        healthStatus: 'Healthy',
        recommendedCare: 'Water regularly and provide indirect sunlight.',
    };
};

// Function to get previous diagnoses for a user
const getUserDiagnoses = async (userId) => {
    try {
        const diagnoses = await Diagnosis.find({ userId }).sort({ createdAt: -1 });
        return diagnoses;
    } catch (error) {
        throw new Error('Error fetching diagnoses: ' + error.message);
    }
};

module.exports = {
    diagnosePlant,
    getUserDiagnoses,
};