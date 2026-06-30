const urlService = require('../services/url.service');
const { sendSuccess, sendPaginated, buildPagination } = require('../utils/response.utils');
const { asyncHandler } = require('../middlewares/errorHandler');

const createUrl = asyncHandler(async (req, res) => {
  const url = await urlService.create(req.user._id, req.body);
  sendSuccess(res, { url }, 'Short URL created successfully', 201);
});

const getUrls = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search, sortBy, sortOrder, filter } = req.query;
  const { urls, total } = await urlService.getUserUrls(req.user._id, { page, limit, search, sortBy, sortOrder, filter });
  sendPaginated(res, { urls }, buildPagination(total, page, limit), 'URLs retrieved');
});

const getUrlById = asyncHandler(async (req, res) => {
  const url = await urlService.getUrlById(req.params.id, req.user._id);
  sendSuccess(res, { url }, 'URL retrieved');
});

const updateUrl = asyncHandler(async (req, res) => {
  const url = await urlService.update(req.params.id, req.user._id, req.body);
  sendSuccess(res, { url }, 'URL updated successfully');
});

const deleteUrl = asyncHandler(async (req, res) => {
  await urlService.delete(req.params.id, req.user._id);
  sendSuccess(res, null, 'URL deleted successfully');
});

const bulkDelete = asyncHandler(async (req, res) => {
  const { urlIds } = req.body;
  if (!urlIds?.length) throw new (require('../middlewares/errorHandler').AppError)('No URL IDs provided', 400);
  const result = await urlService.bulkDelete(urlIds, req.user._id);
  sendSuccess(res, result, `${result.deleted} URLs deleted`);
});

const toggleFavorite = asyncHandler(async (req, res) => {
  const url = await urlService.toggleFavorite(req.params.id, req.user._id);
  sendSuccess(res, { isFavorite: url.isFavorite }, url.isFavorite ? 'Added to favorites' : 'Removed from favorites');
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const stats = await urlService.getUserDashboardStats(req.user._id);
  sendSuccess(res, stats, 'Dashboard stats retrieved');
});

const getQRCode = asyncHandler(async (req, res) => {
  const qrCode = await urlService.generateQRCode(req.params.id, req.user._id);
  sendSuccess(res, { qrCode }, 'QR code generated');
});

module.exports = { createUrl, getUrls, getUrlById, updateUrl, deleteUrl, bulkDelete, toggleFavorite, getDashboardStats, getQRCode };
