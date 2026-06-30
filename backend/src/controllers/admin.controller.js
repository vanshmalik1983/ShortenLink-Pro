const User = require('../models/User');
const Url = require('../models/Url');
const Analytics = require('../models/Analytics');
const { sendSuccess, sendPaginated, buildPagination } = require('../utils/response.utils');
const { asyncHandler } = require('../middlewares/errorHandler');

const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalUrls, totalClicks, activeUrls] = await Promise.all([
    User.countDocuments(),
    Url.countDocuments(),
    Analytics.countDocuments(),
    Url.countDocuments({ isActive: true }),
  ]);
  sendSuccess(res, { totalUsers, totalUrls, totalClicks, activeUrls }, 'Admin stats retrieved');
});

const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const query = {};
  if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    User.countDocuments(query),
  ]);

  sendPaginated(res, { users }, buildPagination(total, page, limit), 'Users retrieved');
});

const getUrls = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const query = {};
  if (search) query.$or = [{ originalUrl: { $regex: search, $options: 'i' } }, { shortCode: { $regex: search, $options: 'i' } }];

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [urls, total] = await Promise.all([
    Url.find(query).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
    Url.countDocuments(query),
  ]);

  sendPaginated(res, { urls }, buildPagination(total, page, limit), 'URLs retrieved');
});

const deleteUrl = asyncHandler(async (req, res) => {
  await Url.findByIdAndDelete(req.params.id);
  await Analytics.deleteMany({ url: req.params.id });
  sendSuccess(res, null, 'URL deleted');
});

const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isActive = !user.isActive;
  await user.save();
  sendSuccess(res, { isActive: user.isActive }, `User ${user.isActive ? 'activated' : 'deactivated'}`);
});

module.exports = { getStats, getUsers, getUrls, deleteUrl, toggleUserStatus };
