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

    // Parse and validate the appointment date
    const parsedDate = new Date(appointmentDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid appointment date format' });
    }

    // Check if time slot is available
    const isAvailable = doctor.isTimeSlotAvailable(parsedDate);
    if (!isAvailable) {
      return res.status(409).json({ message: 'This time slot is already booked' });
    }

    // Create appointment object
    const appointmentData = {
      userId,
      appointmentDate: parsedDate,
      notes,
      status: 'pending',
      createdAt: new Date()
    };

    // Add appointment to doctor's appointments array
    doctor.appointments.push(appointmentData);
    await doctor.save();

    // Get the newly created appointment
    const newAppointment = doctor.appointments[doctor.appointments.length - 1];
    
    // Populate the appointment with user and doctor details
    await doctor.populate('appointments.userId', 'name email');
    const populatedAppointment = {
      _id: newAppointment._id,
      doctorId: doctor,
      userId: newAppointment.userId,
      appointmentDate: newAppointment.appointmentDate,
      status: newAppointment.status,
      notes: newAppointment.notes,
      createdAt: newAppointment.createdAt
    };

    // Format the response with proper timezone information
    const formattedAppointment = {
      ...populatedAppointment,
      appointmentDate: populatedAppointment.appointmentDate.toISOString(),
      createdAt: populatedAppointment.createdAt.toISOString()
    };

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment: formattedAppointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
};

// Get a specific appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    // Find the doctor that has this appointment
    const doctor = await Doctor.findOne({ 'appointments._id': appointmentId })
      .populate('appointments.userId', 'name email');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Find the specific appointment
    const appointment = doctor.appointments.find(apt => apt._id.toString() === appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if the user is authorized to view this appointment
    // Only the appointment's user, doctor, or an admin can view it
    const isUser = appointment.userId._id.toString() === req.user.id;
    const isDoctor = doctor._id.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    
    if (!isUser && !isDoctor && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }
    
    // Format the response
    const formattedAppointment = {
      _id: appointment._id,
      doctorId: {
        _id: doctor._id,
        name: doctor.name,
        specialization: doctor.specialization,
        experience: doctor.experience
      },
      userId: appointment.userId,
      appointmentDate: appointment.appointmentDate,
      status: appointment.status,
      notes: appointment.notes,
      createdAt: appointment.createdAt
    };
    
    res.status(200).json(formattedAppointment);
  } catch (error) {
    console.error('Error getting appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's appointments
exports.getUserAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all doctors that have appointments for this user
    const doctors = await Doctor.find({ 'appointments.userId': userId })
      .populate('appointments.userId', 'name email')
      .sort({ 'appointments.appointmentDate': -1 });

    // Extract and format appointments
    const appointments = [];
    doctors.forEach(doctor => {
      doctor.appointments.forEach(appointment => {
        if (appointment.userId._id.toString() === userId) {
          appointments.push({
            _id: appointment._id,
            doctorId: {
              _id: doctor._id,
              name: doctor.name,
              specialization: doctor.specialization,
              experience: doctor.experience
            },
            userId: appointment.userId,
            appointmentDate: appointment.appointmentDate,
            status: appointment.status,
            notes: appointment.notes,
            createdAt: appointment.createdAt
          });
        }
      });
    });

    // Sort appointments by date (newest first)
    appointments.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

// Get doctor's appointments
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    
    // Find the doctor and populate appointment user details
    const doctor = await Doctor.findById(doctorId)
      .populate('appointments.userId', 'name email');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Format appointments with proper structure
    const formattedAppointments = doctor.appointments.map(appointment => ({
      _id: appointment._id,
      doctorId: {
        _id: doctor._id,
        name: doctor.name,
        specialization: doctor.specialization,
        experience: doctor.experience
      },
      userId: appointment.userId,
      appointmentDate: appointment.appointmentDate.toISOString(),
      status: appointment.status,
      notes: appointment.notes,
      createdAt: appointment.createdAt.toISOString()
    }));

    // Sort by appointment date (newest first)
    formattedAppointments.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

    res.json(formattedAppointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

// Cancel appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;

    // Find the doctor that has this appointment
    const doctor = await Doctor.findOne({ 'appointments._id': appointmentId });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Find the specific appointment
    const appointment = doctor.appointments.find(apt => apt._id.toString() === appointmentId);
    
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

    // Update appointment status
    appointment.status = 'cancelled';
    await doctor.save();

    // Populate user details for response
    await doctor.populate('appointments.userId', 'name email');
    const updatedAppointment = doctor.appointments.find(apt => apt._id.toString() === appointmentId);

    const formattedAppointment = {
      _id: updatedAppointment._id,
      doctorId: {
        _id: doctor._id,
        name: doctor.name,
        specialization: doctor.specialization,
        experience: doctor.experience
      },
      userId: updatedAppointment.userId,
      appointmentDate: updatedAppointment.appointmentDate,
      status: updatedAppointment.status,
      notes: updatedAppointment.notes,
      createdAt: updatedAppointment.createdAt
    };

    res.json({ message: 'Appointment cancelled successfully', appointment: formattedAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
  }
};

// Update appointment status (for doctors/admin)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'approved', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Find the doctor that has this appointment
    const doctor = await Doctor.findOne({ 'appointments._id': appointmentId });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Find the specific appointment
    const appointment = doctor.appointments.find(apt => apt._id.toString() === appointmentId);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update appointment status
    appointment.status = status;
    await doctor.save();

    // Populate user details for response
    await doctor.populate('appointments.userId', 'name email');
    const updatedAppointment = doctor.appointments.find(apt => apt._id.toString() === appointmentId);

    const formattedAppointment = {
      _id: updatedAppointment._id,
      doctorId: {
        _id: doctor._id,
        name: doctor.name,
        specialization: doctor.specialization,
        experience: doctor.experience
      },
      userId: updatedAppointment.userId,
      appointmentDate: updatedAppointment.appointmentDate,
      status: updatedAppointment.status,
      notes: updatedAppointment.notes,
      createdAt: updatedAppointment.createdAt
    };

    res.json({ message: 'Appointment status updated', appointment: formattedAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment status', error: error.message });
  }
};