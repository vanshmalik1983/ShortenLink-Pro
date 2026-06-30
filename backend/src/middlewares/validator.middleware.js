const { validationResult, body, param, query } = require('express-validator');
const { AppError } = require('./errorHandler');

// Run validation and handle errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return next(new AppError(messages[0], 400));
  }
  next();
};

// Auth validators
const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email').trim().isEmail().withMessage('Invalid email address').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
  validate,
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

const forgotPasswordValidator = [
  body('email').trim().isEmail().withMessage('Invalid email').normalizeEmail(),
  validate,
];

const resetPasswordValidator = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
  validate,
];

// URL validators
const createUrlValidator = [
  body('originalUrl').trim().notEmpty().withMessage('URL is required').isURL({ protocols: ['http', 'https'] }).withMessage('Invalid URL format'),
  body('customAlias').optional().trim().matches(/^[a-zA-Z0-9-_]{3,30}$/).withMessage('Alias must be 3-30 alphanumeric characters'),
  body('expiresAt').optional().isISO8601().withMessage('Invalid expiry date format').custom((val) => {
    if (new Date(val) <= new Date()) throw new Error('Expiry date must be in the future');
    return true;
  }),
  body('password').optional().isLength({ min: 4 }).withMessage('URL password must be at least 4 characters'),
  validate,
];

const updateUrlValidator = [
  body('originalUrl').optional().trim().isURL({ protocols: ['http', 'https'] }).withMessage('Invalid URL format'),
  body('customAlias').optional().trim().matches(/^[a-zA-Z0-9-_]{3,30}$/).withMessage('Invalid alias format'),
  body('expiresAt').optional({ nullable: true }).isISO8601().withMessage('Invalid expiry date'),
  validate,
];

module.exports = {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  createUrlValidator,
  updateUrlValidator,
  validate,
};
