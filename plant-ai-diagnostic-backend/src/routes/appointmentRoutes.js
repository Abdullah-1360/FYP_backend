const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to create a new appointment
router.post('/', authMiddleware.authenticateUser, appointmentController.createAppointment);

// Route to get all appointments for a user
router.get('/', authMiddleware.authenticateUser, appointmentController.getUserAppointments);

// Route to cancel an appointment
router.delete('/:id', authMiddleware.authenticateUser, appointmentController.cancelAppointment);

// Route to get appointment details
router.get('/:id', authMiddleware.authenticateUser, appointmentController.getAppointmentDetails);

module.exports = router;