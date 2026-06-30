const { verifyAccessToken } = require('../utils/jwt.utils');
const User = require('../models/User');
const { AppError, asyncHandler } = require('./errorHandler');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Authentication required. Please log in.', 401);
  }

  const decoded = verifyAccessToken(token);
  const user = await User.findById(decoded.userId).select('+isActive');

  if (!user) {
    throw new AppError('User no longer exists', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated', 401);
  }

  req.user = user;
  next();
});

const requireAdmin = asyncHandler(async (req, res, next) => {
  if (req.user?.role !== 'admin') {
    throw new AppError('Admin access required', 403);
  }
  next();
});

const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = verifyAccessToken(token);
      req.user = await User.findById(decoded.userId);
    } catch {
      // Invalid token – proceed without user
    }
  }

  next();
});

module.exports = { protect, requireAdmin, optionalAuth };
