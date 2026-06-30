const UAParser = require('ua-parser-js');
const Analytics = require('../models/Analytics');
const Url = require('../models/Url');
const cache = require('../cache/cache.service');
const { AppError } = require('../middlewares/errorHandler');

class AnalyticsService {
  parseUserAgent(userAgentString) {
    const parser = new UAParser(userAgentString);
    const result = parser.getResult();

    let deviceType = 'desktop';
    if (result.device.type === 'mobile') deviceType = 'mobile';
    else if (result.device.type === 'tablet') deviceType = 'tablet';
    else if (!result.device.type) deviceType = 'desktop';

    return {
      browser: {
        name: result.browser.name || 'Unknown',
        version: result.browser.version || null,
      },
      os: {
        name: result.os.name || 'Unknown',
        version: result.os.version || null,
      },
      device: {
        type: deviceType,
        vendor: result.device.vendor || null,
        model: result.device.model || null,
      },
    };
  }

  parseReferrer(referrerUrl) {
    if (!referrerUrl) return { referrer: null, referrerDomain: 'Direct' };
    try {
      const url = new URL(referrerUrl);
      return { referrer: referrerUrl, referrerDomain: url.hostname };
    } catch {
      return { referrer: referrerUrl, referrerDomain: 'Unknown' };
    }
  }

  async track({ urlId, userId, req }) {
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || '0.0.0.0';
    const referrerUrl = req.headers.referer || req.headers.referrer;

    const { browser, os, device } = this.parseUserAgent(userAgent);
    const { referrer, referrerDomain } = this.parseReferrer(referrerUrl);

    // Check for unique visitor (same IP in last 24h)
    const existingClick = await Analytics.findOne({
      url: urlId,
      ip,
      clickedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    const isUnique = !existingClick;

    const analyticsEntry = await Analytics.create({
      url: urlId,
      user: userId,
      ip,
      userAgent,
      browser,
      os,
      device,
      country: 'Unknown', // Would use IP geo service in production
      referrer,
      referrerDomain,
      isUnique,
      clickedAt: new Date(),
    });

    // Increment URL click counters
    const updateQuery = { $inc: { totalClicks: 1 } };
    if (isUnique) updateQuery.$inc.uniqueClicks = 1;
    await Url.findByIdAndUpdate(urlId, updateQuery);

    return analyticsEntry;
  }

  async getUrlAnalytics(urlId, userId, period = '30d') {
    const url = await Url.findOne({ _id: urlId, user: userId });
    if (!url) throw new AppError('URL not found', 404);

    const dateMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
    const days = dateMap[period] || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [
      totalClicks,
      uniqueClicks,
      clicksByDate,
      topBrowsers,
      topDevices,
      topCountries,
      topReferrers,
      hourlyDistribution,
      dailyDistribution,
    ] = await Promise.all([
      Analytics.countDocuments({ url: urlId, clickedAt: { $gte: startDate } }),
      Analytics.countDocuments({ url: urlId, isUnique: true, clickedAt: { $gte: startDate } }),

      Analytics.aggregate([
        { $match: { url: url._id, clickedAt: { $gte: startDate } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$clickedAt' } }, clicks: { $sum: 1 } } },
        { $sort: { '_id': 1 } },
      ]),

      Analytics.aggregate([
        { $match: { url: url._id, clickedAt: { $gte: startDate } } },
        { $group: { _id: '$browser.name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),

      Analytics.aggregate([
        { $match: { url: url._id, clickedAt: { $gte: startDate } } },
        { $group: { _id: '$device.type', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      Analytics.aggregate([
        { $match: { url: url._id, clickedAt: { $gte: startDate } } },
        { $group: { _id: '$country', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      Analytics.aggregate([
        { $match: { url: url._id, clickedAt: { $gte: startDate }, referrerDomain: { $ne: 'Direct' } } },
        { $group: { _id: '$referrerDomain', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      Analytics.aggregate([
        { $match: { url: url._id, clickedAt: { $gte: startDate } } },
        { $group: { _id: { $hour: '$clickedAt' }, count: { $sum: 1 } } },
        { $sort: { '_id': 1 } },
      ]),

      Analytics.aggregate([
        { $match: { url: url._id, clickedAt: { $gte: startDate } } },
        { $group: { _id: { $dayOfWeek: '$clickedAt' }, count: { $sum: 1 } } },
        { $sort: { '_id': 1 } },
      ]),
    ]);

    return {
      url: { ...url.toObject(), shortUrl: require('../utils/url.utils').buildShortUrl(url.shortCode) },
      period,
      totalClicks,
      uniqueClicks,
      clicksByDate: clicksByDate.map((d) => ({ date: d._id, clicks: d.clicks })),
      topBrowsers: topBrowsers.map((b) => ({ name: b._id || 'Unknown', count: b.count })),
      topDevices: topDevices.map((d) => ({ type: d._id || 'unknown', count: d.count })),
      topCountries: topCountries.map((c) => ({ country: c._id || 'Unknown', count: c.count })),
      topReferrers: topReferrers.map((r) => ({ domain: r._id, count: r.count })),
      hourlyDistribution: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: hourlyDistribution.find((h) => h._id === i)?.count || 0,
      })),
      dailyDistribution: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => ({
        day,
        count: dailyDistribution.find((d) => d._id === i + 1)?.count || 0,
      })),
    };
  }

  async getOverviewAnalytics(userId, period = '30d') {
    const dateMap = { '7d': 7, '30d': 30, '90d': 90 };
    const days = dateMap[period] || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [clickTimeline, deviceBreakdown, topUrls] = await Promise.all([
      Analytics.aggregate([
        { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(userId), clickedAt: { $gte: startDate } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$clickedAt' } }, clicks: { $sum: 1 } } },
        { $sort: { '_id': 1 } },
      ]),

      Analytics.aggregate([
        { $match: { user: require('mongoose').Types.ObjectId.createFromHexString(userId), clickedAt: { $gte: startDate } } },
        { $group: { _id: '$device.type', count: { $sum: 1 } } },
      ]),

      Url.find({ user: userId }).sort({ totalClicks: -1 }).limit(10).select('shortCode title originalUrl totalClicks uniqueClicks').lean(),
    ]);

    return {
      clickTimeline: clickTimeline.map((d) => ({ date: d._id, clicks: d.clicks })),
      deviceBreakdown: deviceBreakdown.map((d) => ({ type: d._id || 'unknown', count: d.count })),
      topUrls: topUrls.map((u) => ({ ...u, shortUrl: require('../utils/url.utils').buildShortUrl(u.shortCode) })),
    };
  }
}

module.exports = new AnalyticsService();
