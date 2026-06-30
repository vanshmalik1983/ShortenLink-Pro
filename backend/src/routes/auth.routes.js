// auth.routes.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authLimiter } = require('../middlewares/rateLimiter');
const { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } = require('../middlewares/validator.middleware');

router.post('/register', authLimiter, registerValidator, ctrl.register);
router.post('/login', authLimiter, loginValidator, ctrl.login);
router.post('/logout', protect, ctrl.logout);
router.post('/refresh', ctrl.refreshToken);
router.get('/verify-email', ctrl.verifyEmail);
router.post('/resend-verification', ctrl.resendVerification);
router.post('/forgot-password', authLimiter, forgotPasswordValidator, ctrl.forgotPassword);
router.post('/reset-password', resetPasswordValidator, ctrl.resetPassword);
router.get('/me', protect, ctrl.getMe);

module.exports = router;
