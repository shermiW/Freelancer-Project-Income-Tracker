const { body, validationResult } = require('express-validator');

// Middleware to handle validation result
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

// Auth Validation Rules
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required').trim(),
  body('email').isEmail().withMessage('Please include a valid email address').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  validate,
];

const loginValidation = [
  body('email').isEmail().withMessage('Please include a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

// Client Validation Rules
const createClientValidation = [
  body('name').notEmpty().withMessage('Client name is required').trim(),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Please include a valid email address').normalizeEmail(),
  validate,
];

const updateClientValidation = [
  body('name').optional().notEmpty().withMessage('Client name cannot be empty').trim(),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Please include a valid email address').normalizeEmail(),
  validate,
];

// Project Validation Rules
const createProjectValidation = [
  body('title').notEmpty().withMessage('Project title is required').trim(),
  body('client').notEmpty().withMessage('Client ID is required').isMongoId().withMessage('Invalid client ID format'),
  body('fee')
    .notEmpty()
    .withMessage('Fee is required')
    .isFloat({ min: 0 })
    .withMessage('Fee must be a positive number or zero'),
  body('amountPaid')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount paid must be a positive number or zero'),
  validate,
];

const updateProjectValidation = [
  body('title').optional().notEmpty().withMessage('Project title cannot be empty').trim(),
  body('client').optional().isMongoId().withMessage('Invalid client ID format'),
  body('fee')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Fee must be a positive number or zero'),
  body('amountPaid')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount paid must be a positive number or zero'),
  validate,
];

module.exports = {
  validate,
  registerValidation,
  loginValidation,
  createClientValidation,
  updateClientValidation,
  createProjectValidation,
  updateProjectValidation,
};
