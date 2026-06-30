const analyticsService = require('../services/analytics.service');
const { sendSuccess } = require('../utils/response.utils');
const { asyncHandler } = require('../middlewares/errorHandler');

const getUrlAnalytics = asyncHandler(async (req, res) => {
  const { period = '30d' } = req.query;
  const data = await analyticsService.getUrlAnalytics(req.params.urlId, req.user._id, period);
  sendSuccess(res, data, 'Analytics retrieved');
});

const getOverviewAnalytics = asyncHandler(async (req, res) => {
  const { period = '30d' } = req.query;
  const data = await analyticsService.getOverviewAnalytics(req.user._id.toString(), period);
  sendSuccess(res, data, 'Overview analytics retrieved');
});

module.exports = { getUrlAnalytics, getOverviewAnalytics };
