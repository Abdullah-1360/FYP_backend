const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to create a new appointment
router.post('/', authMiddleware.authenticate, appointmentController.createAppointment);

// Route to get all appointments for a user
router.get('/', authMiddleware.authenticate, appointmentController.getUserAppointments);

// Route to cancel an appointment
router.delete('/:id', authMiddleware.authenticate, appointmentController.cancelAppointment);

// Route to get appointment details
router.get('/:id', authMiddleware.authenticate, appointmentController.getAppointmentDetails);

module.exports = router;