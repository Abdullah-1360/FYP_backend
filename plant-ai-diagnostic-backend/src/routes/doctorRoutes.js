const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Route to get all doctors
router.get('/', doctorController.getAllDoctors);

// Route to get a specific doctor by ID
router.get('/:id', doctorController.getDoctorById);

// Route to rate a doctor
router.post('/:id/rate', doctorController.rateDoctor);

// Route to get doctor ratings
router.get('/:id/ratings', doctorController.getDoctorRatings);

// Route to update doctor profile
router.put('/:id', doctorController.updateDoctorProfile);

// Route to delete a doctor
router.delete('/:id', doctorController.deleteDoctor);

module.exports = router;