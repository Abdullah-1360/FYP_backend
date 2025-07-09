const Medicine = require('../models/Medicine');

// Add a new medicine
exports.addMedicine = async (req, res) => {
    try {
        const medicine = new Medicine(req.body);
        await medicine.save();
        res.status(201).json({ message: 'Medicine added successfully', medicine });
    } catch (error) {
        res.status(400).json({ message: 'Error adding medicine', error });
    }
};

// Update an existing medicine
exports.updateMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const medicine = await Medicine.findByIdAndUpdate(id, req.body, { new: true });
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.json({ message: 'Medicine updated successfully', medicine });
    } catch (error) {
        res.status(400).json({ message: 'Error updating medicine', error });
    }
};

// Get all medicines
exports.getAllMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.find();
        res.json(medicines);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving medicines', error });
    }
};

// Get a medicine by ID
exports.getMedicineById = async (req, res) => {
    try {
        const { id } = req.params;
        const medicine = await Medicine.findById(id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.json(medicine);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving medicine', error });
    }
};

// Delete a medicine
exports.deleteMedicine = async (req, res) => {
    try {
        const { id } = req.params;
        const medicine = await Medicine.findByIdAndDelete(id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.json({ message: 'Medicine deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting medicine', error });
    }
};