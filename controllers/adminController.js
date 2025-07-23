const User = require('../models/User');
const Medicine = require('../models/Medicine');

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
const Doctor = require('../models/Doctor');

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