const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, appointmentDate, notes } = req.body;
    const userId = req.user.id; // From auth middleware

    // Validate doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if user is blocked
    const user = await User.findById(userId);
    if (user.isBlocked) {
      return res.status(403).json({ message: 'User is blocked from making appointments' });
    }

    // Check if time slot is available
    const isAvailable = await Appointment.isTimeSlotAvailable(doctorId, new Date(appointmentDate));
    if (!isAvailable) {
      return res.status(409).json({ message: 'This time slot is already booked' });
    }

    // Create appointment
    const appointment = new Appointment({
      doctorId,
      userId,
      appointmentDate: new Date(appointmentDate),
      notes,
      status: 'pending'
    });

    await appointment.save();

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: await appointment.populate(['doctorId', 'userId'])
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
};

// Get a specific appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    // Find the appointment and populate doctor and user details
    const appointment = await Appointment.findById(appointmentId)
      .populate('doctorId', 'name specialization experience')
      .populate('userId', 'name email');
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if the user is authorized to view this appointment
    // Only the appointment's user, doctor, or an admin can view it
    const isUser = appointment.userId._id.toString() === req.user.id;
    const isDoctor = appointment.doctorId._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isUser && !isDoctor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }
    
    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error getting appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's appointments
exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await Appointment.find({ userId })
      .populate('doctorId')
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

// Get doctor's appointments
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const appointments = await Appointment.find({ doctorId })
      .populate('userId')
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;

    const appointment = await Appointment.findById(appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Verify user owns this appointment
    if (appointment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }

    // Check if appointment can be cancelled
    if (appointment.status === 'cancelled') {
      return res.status(400).json({ message: 'Appointment is already cancelled' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
  }
};

// Update appointment status (for doctors/admin)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    ).populate(['doctorId', 'userId']);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment status updated', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment status', error: error.message });
  }
};