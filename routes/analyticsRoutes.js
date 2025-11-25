const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Get comprehensive analytics
router.get('/', analyticsController.getAnalytics);

// Get dashboard summary
router.get('/summary', analyticsController.getDashboardSummary);

module.exports = router;
