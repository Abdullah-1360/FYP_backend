const User = require('../models/User');
const Medicine = require('../models/Medicine');
const Doctor = require('../models/Doctor');

// Function to block a user
exports.blockUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndUpdate(id, { isBlocked: true });
        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error blocking user', error });
    }
};

// Function to view all users
exports.viewUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error });
    }
};

// Function to track medicines
exports.trackMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find();
        res.status(200).json(medicines);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving medicines', error });
    }
};
// add at the bottom

// Add a new doctor
exports.addDoctor = async (req, res) => {
  try {
    const { name, specialization, experience } = req.body;

    if (!name || !specialization || experience == null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const doctor = new Doctor({
      name,
      specialization,
      experience,
    });

    await doctor.save();
    res.status(201).json({ message: 'Doctor added successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Error adding doctor', error: error.message });
  }
};
exports.unblockUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndUpdate(id, { isBlocked: false });
        res.status(200).json({ message: 'User unblocked successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error unblocking user', error });
    }
};

// Function to get all doctors
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving doctors', error });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

// Delete a doctor
exports.deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        await Doctor.findByIdAndDelete(id);
        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting doctor', error });
    }
};

// Add medicine
exports.addMedicine = async (req, res) => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body;
    if (!name || !description || price == null || stock == null || !category || !imageUrl) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const medicine = new Medicine({
      name,
      description,
      price,
      stock,
      category,
      imageUrl,
    });

    await medicine.save();
    res.status(201).json({ message: 'Medicine added successfully', medicine });
  } catch (error) {
    res.status(500).json({ message: 'Error adding medicine', error });
  }
};

// Update medicine
exports.updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await Medicine.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({ message: 'Medicine updated', medicine: updated });
  } catch (error) {
    res.status(500).json({ message: 'Error updating medicine', error });
  }
};

// Delete medicine
exports.deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    await Medicine.findByIdAndDelete(id);
    res.status(200).json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting medicine', error });
  }
};

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    // Find all doctors with their appointments
    const doctors = await Doctor.find()
      .populate('appointments.userId', 'name email')
      .sort({ 'appointments.appointmentDate': -1 });
    
    // Extract and transform appointments from all doctors
    const transformedAppointments = [];
    doctors.forEach(doctor => {
      doctor.appointments.forEach(appointment => {
        transformedAppointments.push({
          _id: appointment._id,
          patientName: appointment.userId?.name || 'Unknown Patient',
          doctorName: doctor.name || 'Unknown Doctor',
          appointmentDate: appointment.appointmentDate,
          status: appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).toLowerCase(),
          notes: appointment.notes,
          createdAt: appointment.createdAt
        });
      });
    });
    
    // Sort all appointments by date (newest first)
    transformedAppointments.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
    
    res.status(200).json(transformedAppointments);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving appointments', error: error.message });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['Pending', 'Confirmed', 'Approved', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Find the doctor that has this appointment
    const doctor = await Doctor.findOne({ 'appointments._id': id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Find the specific appointment
    const appointment = doctor.appointments.find(apt => apt._id.toString() === id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Update appointment status (convert to lowercase for consistency)
    appointment.status = status.toLowerCase();
    await doctor.save();
    
    // Populate user details for response
    await doctor.populate('appointments.userId', 'name email');
    const updatedAppointment = doctor.appointments.find(apt => apt._id.toString() === id);
    
    const formattedAppointment = {
      _id: updatedAppointment._id,
      patientName: updatedAppointment.userId?.name || 'Unknown Patient',
      doctorName: doctor.name || 'Unknown Doctor',
      appointmentDate: updatedAppointment.appointmentDate,
      status: updatedAppointment.status.charAt(0).toUpperCase() + updatedAppointment.status.slice(1).toLowerCase(),
      notes: updatedAppointment.notes,
      createdAt: updatedAppointment.createdAt
    };
    
    res.status(200).json({ message: 'Appointment status updated successfully', appointment: formattedAppointment });
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment status', error: error.message });
  }
};

// Reschedule appointment
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { appointmentDate } = req.body;
    
    if (!appointmentDate) {
      return res.status(400).json({ message: 'Appointment date is required' });
    }
    
    // Ensure the date is properly parsed as UTC
    const parsedDate = new Date(appointmentDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid appointment date format' });
    }
    
    // Find the doctor that has this appointment
    const doctor = await Doctor.findOne({ 'appointments._id': id });
    
    if (!doctor) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Find the specific appointment
    const existingAppointment = doctor.appointments.find(apt => apt._id.toString() === id);
    
    if (!existingAppointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if the new time slot is available
    const isAvailable = doctor.isTimeSlotAvailable(parsedDate);
    if (!isAvailable) {
      return res.status(409).json({ message: 'This time slot is already booked' });
    }
    
    // Update the existing appointment
    existingAppointment.appointmentDate = parsedDate;
    existingAppointment.status = 'pending'; // Reset status to pending for rescheduled appointment
    existingAppointment.notes = (existingAppointment.notes || '') + ' (Rescheduled)';
    
    await doctor.save();
    
    // Populate user details for response
    await doctor.populate('appointments.userId', 'name email');
    const updatedAppointment = doctor.appointments.find(apt => apt._id.toString() === id);
    
    const formattedAppointment = {
      _id: updatedAppointment._id,
      patientName: updatedAppointment.userId?.name || 'Unknown Patient',
      doctorName: doctor.name || 'Unknown Doctor',
      appointmentDate: updatedAppointment.appointmentDate,
      status: updatedAppointment.status.charAt(0).toUpperCase() + updatedAppointment.status.slice(1).toLowerCase(),
      notes: updatedAppointment.notes,
      createdAt: updatedAppointment.createdAt
    };
    
    res.status(200).json({ 
      message: 'Appointment rescheduled successfully', 
      appointment: formattedAppointment
    });
   } catch (error) {
     res.status(500).json({ message: 'Error rescheduling appointment', error: error.message });
   }
 };