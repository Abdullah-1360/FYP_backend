const Appointment = require('../models/Appointment');

// Create a new appointment
exports.createAppointment = async (req, res) => {
    try {
        const { doctorId, date, time } = req.body;
        const userId = req.user.id;
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
        const appointments = await Appointment.find({ userId: req.user.id });
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
};

// Cancel an appointment
exports.cancelAppointment = async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Appointment canceled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error canceling appointment', error: error.message });
    }
};

// Get appointment details
exports.getAppointmentDetails = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointment details', error: error.message });
    }
};