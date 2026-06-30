const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validator.middleware');

router.use(protect);

router.patch('/profile', [
  body('name').optional().trim().notEmpty().isLength({ max: 50 }),
  validate,
], ctrl.updateProfile);

router.patch('/password', [
  body('currentPassword').notEmpty().withMessage('Current password required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  validate,
], ctrl.changePassword);

router.patch('/avatar', ctrl.uploadAvatar);

router.delete('/account', [
  body('password').notEmpty().withMessage('Password required to delete account'),
  validate,
], ctrl.deleteAccount);

module.exports = router;
