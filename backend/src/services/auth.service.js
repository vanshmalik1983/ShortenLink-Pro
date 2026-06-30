const crypto = require('crypto');
const User = require('../models/User');
const { PasswordReset, EmailVerification } = require('../models/Token');
const { generateAccessToken, generateRefreshToken, saveRefreshToken } = require('../utils/jwt.utils');
const { sendEmail } = require('../config/email');
const { AppError } = require('../middlewares/errorHandler');
const { emailVerificationTemplate, passwordResetTemplate, welcomeTemplate } = require('../utils/email.templates');

class AuthService {
  async register({ name, email, password }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new AppError('Email already registered', 400);

    const user = await User.create({ name, email, password });

    // Send verification email
    await this.sendVerificationEmail(user);

    return user;
  }

  async login({ email, password, rememberMe = false }) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new AppError('Invalid email or password', 401);

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError('Invalid email or password', 401);

    if (!user.isActive) throw new AppError('Your account has been deactivated', 403);

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    const accessToken = generateAccessToken({ userId: user._id, role: user.role });
    const refreshToken = generateRefreshToken();
    await saveRefreshToken(user._id, refreshToken, rememberMe);

    return { user: user.toPublicJSON(), accessToken, refreshToken };
  }

  async sendVerificationEmail(user) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await EmailVerification.findOneAndDelete({ user: user._id });
    await EmailVerification.create({ user: user._id, token, expiresAt });

    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    const html = emailVerificationTemplate({ name: user.name, verifyUrl });

    await sendEmail({ to: user.email, subject: 'Verify your ShortLink Pro account', html });
  }

  async verifyEmail(token) {
    const record = await EmailVerification.findOne({
      token,
      expiresAt: { $gt: new Date() },
    });
    if (!record) throw new AppError('Invalid or expired verification link', 400);

    await User.findByIdAndUpdate(record.user, { isEmailVerified: true });
    await EmailVerification.deleteOne({ _id: record._id });

    return true;
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    // Don't reveal whether user exists
    if (!user) return true;

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await PasswordReset.findOneAndDelete({ user: user._id });
    await PasswordReset.create({ user: user._id, token, expiresAt });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    const html = passwordResetTemplate({ name: user.name, resetUrl });

    await sendEmail({ to: user.email, subject: 'Reset your ShortLink Pro password', html });

    return true;
  }

  async resetPassword(token, newPassword) {
    const record = await PasswordReset.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });
    if (!record) throw new AppError('Invalid or expired reset link', 400);

    const user = await User.findById(record.user);
    if (!user) throw new AppError('User not found', 404);

    user.password = newPassword;
    await user.save();

    record.used = true;
    await record.save();

    return true;
  }

  async refreshAccessToken(refreshToken) {
    const { findRefreshToken, generateAccessToken: genToken, generateRefreshToken: genRefresh, saveRefreshToken: saveToken, revokeRefreshToken } = require('../utils/jwt.utils');

    const tokenRecord = await findRefreshToken(refreshToken);
    if (!tokenRecord) throw new AppError('Invalid or expired refresh token', 401);

    const user = await User.findById(tokenRecord.user);
    if (!user || !user.isActive) throw new AppError('User not found or deactivated', 401);

    const newAccessToken = genToken({ userId: user._id, role: user.role });
    const newRefreshToken = genRefresh();

    await revokeRefreshToken(refreshToken);
    await saveToken(user._id, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken, user: user.toPublicJSON() };
  }
}

module.exports = new AuthService();
