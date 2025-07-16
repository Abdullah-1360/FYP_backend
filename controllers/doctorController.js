const Doctor = require('../models/Doctor');

// Get all doctors
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctors', error });
    }
};

// Get doctor by ID
exports.getDoctorById = async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctor', error });
    }
};

// Rate a doctor
exports.rateDoctor = async (req, res) => {
    const { id } = req.params;
    const { rating } = req.body;
    try {
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        doctor.ratings.push(rating);
        await doctor.save();
        res.status(200).json({ message: 'Rating submitted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error rating doctor', error });
    }
};

// Get doctor ratings
exports.getDoctorRatings = async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json({ ratings: doctor.ratings });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching doctor ratings', error });
    }
};

// Update doctor profile
exports.updateDoctorProfile = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const doctor = await Doctor.findByIdAndUpdate(id, updates, { new: true });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: 'Error updating doctor profile', error });
    }
};

// Delete a doctor
exports.deleteDoctor = async (req, res) => {
    const { id } = req.params;
    try {
        const doctor = await Doctor.findByIdAndDelete(id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating doctor profile', error });
    }
};