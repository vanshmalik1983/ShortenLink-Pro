const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Url = require('../models/Url');
const Analytics = require('../models/Analytics');
const { RefreshToken } = require('../models/Token');
const cache = require('../cache/cache.service');
const { sendSuccess } = require('../utils/response.utils');
const { asyncHandler, AppError } = require('../middlewares/errorHandler');

const updateProfile = asyncHandler(async (req, res) => {
  const { name, emailPreferences } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (emailPreferences) updates.emailPreferences = { ...req.user.emailPreferences, ...emailPreferences };

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  await cache.invalidateUserCache(req.user._id.toString());
  sendSuccess(res, { user: user.toPublicJSON() }, 'Profile updated');
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new AppError('Current password is incorrect', 400);

  user.password = newPassword;
  await user.save();

  // Revoke all refresh tokens for security
  await RefreshToken.deleteMany({ user: req.user._id });

  sendSuccess(res, null, 'Password changed successfully. Please log in again.');
});

const uploadAvatar = asyncHandler(async (req, res) => {
  const { avatar } = req.body; // base64 data URL
  if (!avatar) throw new AppError('Avatar is required', 400);
  if (avatar.length > 2 * 1024 * 1024) throw new AppError('Avatar must be less than 2MB', 400); // ~1.5MB base64

  const user = await User.findByIdAndUpdate(req.user._id, { avatar }, { new: true });
  sendSuccess(res, { avatar: user.avatar }, 'Avatar updated');
});

const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError('Incorrect password', 400);

  await Promise.all([
    Analytics.deleteMany({ user: req.user._id }),
    Url.deleteMany({ user: req.user._id }),
    RefreshToken.deleteMany({ user: req.user._id }),
    User.findByIdAndDelete(req.user._id),
  ]);

  sendSuccess(res, null, 'Account deleted permanently');
});

module.exports = { updateProfile, changePassword, uploadAvatar, deleteAccount };
