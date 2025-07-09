const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');

// Route to get all medicines in the marketplace
router.get('/medicines', marketplaceController.getAllMedicines);

// Route to purchase a medicine
router.post('/medicines/purchase', marketplaceController.purchaseMedicine);

// Route to get details of a specific medicine
router.get('/medicines/:id', marketplaceController.getMedicineById);

// Route to add a new medicine to the marketplace (admin only)
router.post('/medicines', marketplaceController.addMedicine);

// Route to update an existing medicine (admin only)
router.put('/medicines/:id', marketplaceController.updateMedicine);

// Route to delete a medicine from the marketplace (admin only)
router.delete('/medicines/:id', marketplaceController.deleteMedicine);

module.exports = router;