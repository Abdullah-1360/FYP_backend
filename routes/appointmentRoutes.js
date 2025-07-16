const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/authMiddleware');
const {
  createAppointment,
  getUserAppointments,
  getDoctorAppointments,
  cancelAppointment,
  updateAppointmentStatus
} = require('../controllers/appointmentController');

// User routes
router.post('/', authenticateUser, createAppointment);
router.get('/my-appointments', authenticateUser, getUserAppointments);
router.post('/:appointmentId/cancel', authenticateUser, cancelAppointment);

// Doctor routes
router.get('/doctor/:doctorId', authenticateUser, getDoctorAppointments);
router.patch('/:appointmentId/status', authenticateUser, updateAppointmentStatus);

module.exports = router;