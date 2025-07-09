const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

// Route to add a new medicine
router.post('/', medicineController.addMedicine);

// Route to update an existing medicine
router.put('/:id', medicineController.updateMedicine);

// Route to get all medicines
router.get('/', medicineController.getAllMedicines);

// Route to get a specific medicine by ID
router.get('/:id', medicineController.getMedicineById);

// Route to delete a medicine
router.delete('/:id', medicineController.deleteMedicine);

module.exports = router;