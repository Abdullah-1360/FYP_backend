const mongoose = require('mongoose');

const DiagnosisSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        required: true
    },
    diagnosisResult: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Diagnosis = mongoose.model('Diagnosis', DiagnosisSchema);

module.exports = Diagnosis;