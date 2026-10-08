const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

// Route: GET /api/dashboard/stats
router.get('/stats', getDashboardStats);

module.exports = router;
