const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');
// Route to get all medicines in the marketplace
router.get('/medicines', marketplaceController.listMedicines);

// Route to purchase a medicine
router.post('/medicines/purchase', marketplaceController.purchaseMedicine);

// Route to add a new medicine to the marketplace (admin only)
router.post('/medicines', marketplaceController.addMedicine);

// Route to update an existing medicine (admin only)
router.put('/medicines/:medicineId', marketplaceController.updateMedicine);

// Route to delete a medicine from the marketplace (admin only)
router.delete('/medicines/:medicineId', marketplaceController.deleteMedicine);

module.exports = router;