const authService = require('../services/auth.service');
const { revokeRefreshToken, revokeAllUserTokens, findRefreshToken, generateAccessToken, generateRefreshToken, saveRefreshToken } = require('../utils/jwt.utils');
const { sendSuccess, sendError } = require('../utils/response.utils');
const { asyncHandler } = require('../middlewares/errorHandler');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await authService.register({ name, email, password });
  sendSuccess(res, { user: user.toPublicJSON() }, 'Registration successful! Please check your email to verify your account.', 201);
});

const login = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;
  const { user, accessToken, refreshToken } = await authService.login({ email, password, rememberMe });
  sendSuccess(res, { user, accessToken, refreshToken }, 'Login successful');
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) await revokeRefreshToken(refreshToken);
  sendSuccess(res, null, 'Logged out successfully');
});

const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) throw new (require('../middlewares/errorHandler').AppError)('Refresh token required', 400);
  const result = await authService.refreshAccessToken(token);
  sendSuccess(res, result, 'Token refreshed');
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  if (!token) throw new (require('../middlewares/errorHandler').AppError)('Verification token required', 400);
  await authService.verifyEmail(token);
  sendSuccess(res, null, 'Email verified successfully');
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  sendSuccess(res, null, 'If an account with that email exists, a password reset link has been sent.');
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  await authService.resetPassword(token, password);
  sendSuccess(res, null, 'Password reset successful. You can now log in with your new password.');
});

const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const User = require('../models/User');
  const user = await User.findOne({ email });
  if (user && !user.isEmailVerified) {
    await authService.sendVerificationEmail(user);
  }
  sendSuccess(res, null, 'If your email is registered and unverified, a new verification link has been sent.');
});

const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, { user: req.user.toPublicJSON() }, 'User retrieved');
});

module.exports = { register, login, logout, refreshToken, verifyEmail, forgotPassword, resetPassword, resendVerification, getMe };
