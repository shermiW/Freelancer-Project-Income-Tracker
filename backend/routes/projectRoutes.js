const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getDashboardStats,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/stats', getDashboardStats);
router.route('/').get(getProjects).post(createProject);
router.route('/:id').put(updateProject).delete(deleteProject);

module.exports = router;
