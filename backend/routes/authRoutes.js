const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerValidation, loginValidation } = require('../middleware/validatorMiddleware');

// Route: POST /api/auth/register
router.post('/register', registerValidation, registerUser);

// Route: POST /api/auth/login
router.post('/login', loginValidation, loginUser);

// Route: GET /api/auth/me
router.get('/me', protect, getMe);

module.exports = router;
