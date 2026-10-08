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
const {
  createProjectValidation,
  updateProjectValidation,
} = require('../middleware/validatorMiddleware');

router.use(protect);

// Route: GET /api/projects/stats
router.get('/stats', getDashboardStats);

router.route('/')
  .get(getProjects)
  .post(createProjectValidation, createProject);

router.route('/:id')
  .put(updateProjectValidation, updateProject)
  .delete(deleteProject);

module.exports = router;
