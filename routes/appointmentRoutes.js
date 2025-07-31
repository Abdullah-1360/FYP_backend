const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/authMiddleware');
const {
  createAppointment,
  getUserAppointments,
  getDoctorAppointments,
  cancelAppointment,
  updateAppointmentStatus,
  getAppointmentById
} = require('../controllers/appointmentController');

router.post('/', authenticateUser, createAppointment);
router.get('/my-appointments', authenticateUser, getUserAppointments);
router.post('/:appointmentId/cancel', authenticateUser, cancelAppointment);

// Doctor routes
router.get('/doctor/:doctorId', authenticateUser, getDoctorAppointments);
router.patch('/:appointmentId/status', authenticateUser, updateAppointmentStatus);

// Common routes
router.get('/:appointmentId', authenticateUser, getAppointmentById);

module.exports = router;