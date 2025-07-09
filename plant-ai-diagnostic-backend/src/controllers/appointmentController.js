const Appointment = require('../models/Appointment');

// Create a new appointment
exports.createAppointment = async (req, res) => {
    try {
        const { userId, doctorId, date, time } = req.body;
        const newAppointment = new Appointment({ userId, doctorId, date, time });
        await newAppointment.save();
        res.status(201).json({ message: 'Appointment created successfully', appointment: newAppointment });
    } catch (error) {
        res.status(500).json({ message: 'Error creating appointment', error: error.message });
    }
};

// Get all appointments for a user
exports.getUserAppointments = async (req, res) => {
    try {
        const { userId } = req.params;
        const appointments = await Appointment.find({ userId });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
};

// Cancel an appointment
exports.cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        await Appointment.findByIdAndDelete(appointmentId);
        res.status(200).json({ message: 'Appointment canceled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error canceling appointment', error: error.message });
    }
};