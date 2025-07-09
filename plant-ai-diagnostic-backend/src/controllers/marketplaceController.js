const Marketplace = require('../models/Marketplace');

// List all medicines in the marketplace
exports.listMedicines = async (req, res) => {
    try {
        const medicines = await Marketplace.find();
        res.status(200).json(medicines);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving medicines', error });
    }
};

// Purchase a medicine
exports.purchaseMedicine = async (req, res) => {
    const { medicineId, userId, quantity } = req.body;
    try {
        const medicine = await Marketplace.findById(medicineId);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        // Logic to handle the purchase (e.g., update inventory, create order)
        res.status(200).json({ message: 'Medicine purchased successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error purchasing medicine', error });
    }
};

// Add a new medicine to the marketplace
exports.addMedicine = async (req, res) => {
    const { name, description, price, stock } = req.body;
    try {
        const newMedicine = new Marketplace({ name, description, price, stock });
        await newMedicine.save();
        res.status(201).json(newMedicine);
    } catch (error) {
        res.status(500).json({ message: 'Error adding medicine', error });
    }
};

// Update medicine details
exports.updateMedicine = async (req, res) => {
    const { medicineId } = req.params;
    const updates = req.body;
    try {
        const updatedMedicine = await Marketplace.findByIdAndUpdate(medicineId, updates, { new: true });
        if (!updatedMedicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.status(200).json(updatedMedicine);
    } catch (error) {
        res.status(500).json({ message: 'Error updating medicine', error });
    }
};
// Get details of a specific medicine
exports.getMedicineById = async (req, res) => {
    try {
        const medicine = await Marketplace.findById(req.params.medicineId);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.status(200).json(medicine);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving medicine', error });
    }
};

// Delete a medicine from the marketplace
exports.deleteMedicine = async (req, res) => {
    const { medicineId } = req.params;
    try {
        const deletedMedicine = await Marketplace.findByIdAndDelete(medicineId);
        if (!deletedMedicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.status(200).json({ message: 'Medicine deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting medicine', error });
    }
};