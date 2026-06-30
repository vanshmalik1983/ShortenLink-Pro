const QRCode = require('qrcode');
const Url = require('../models/Url');
const Analytics = require('../models/Analytics');
const cache = require('../cache/cache.service');
const { generateUniqueShortCode, buildShortUrl, isValidAlias, sanitizeUrl } = require('../utils/url.utils');
const { AppError } = require('../middlewares/errorHandler');
const { addToQueue } = require('../jobs/queue');

class UrlService {
  async create(userId, data) {
    const { originalUrl, customAlias, title, password, expiresAt, description, tags } = data;

    const sanitized = sanitizeUrl(originalUrl);

    // Handle custom alias
    let shortCode;
    if (customAlias) {
      if (!isValidAlias(customAlias)) throw new AppError('Invalid alias format', 400);
      const exists = await Url.exists({ shortCode: customAlias });
      if (exists) throw new AppError('This alias is already taken', 409);
      shortCode = customAlias;
    } else {
      shortCode = await generateUniqueShortCode();
    }

    const urlData = {
      user: userId,
      originalUrl: sanitized,
      shortCode,
      customAlias: customAlias || null,
      title: title || null,
      description: description || null,
      tags: tags || [],
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    };

    if (password) {
      urlData.password = password;
      urlData.isPasswordProtected = true;
    }

    const url = await Url.create(urlData);
    const shortUrl = buildShortUrl(shortCode);

    // Queue QR code generation
    await addToQueue('qr-generation', { urlId: url._id.toString(), shortUrl });

    // Invalidate user cache
    await cache.invalidateUserCache(userId.toString());

    return { ...url.toObject(), shortUrl };
  }

  async getUserUrls(userId, { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'desc', filter }) {
    const query = { user: userId };

    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: 'i' } },
        { shortCode: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    if (filter === 'active') query.isActive = true;
    if (filter === 'expired') query.expiresAt = { $lt: new Date() };
    if (filter === 'favorites') query.isFavorite = true;
    if (filter === 'protected') query.isPasswordProtected = true;

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [urls, total] = await Promise.all([
      Url.find(query).sort(sort).skip(skip).limit(parseInt(limit)).lean(),
      Url.countDocuments(query),
    ]);

    const enriched = urls.map((url) => ({
      ...url,
      shortUrl: buildShortUrl(url.shortCode),
      isExpired: url.expiresAt ? new Date() > url.expiresAt : false,
    }));

    return { urls: enriched, total };
  }

  async getUrlById(urlId, userId) {
    const url = await Url.findOne({ _id: urlId, user: userId });
    if (!url) throw new AppError('URL not found', 404);
    return { ...url.toObject(), shortUrl: buildShortUrl(url.shortCode) };
  }

  async update(urlId, userId, updates) {
    const url = await Url.findOne({ _id: urlId, user: userId });
    if (!url) throw new AppError('URL not found', 404);

    const allowed = ['originalUrl', 'title', 'description', 'isActive', 'expiresAt', 'tags', 'isFavorite', 'utmSource', 'utmMedium', 'utmCampaign'];
    allowed.forEach((field) => {
      if (updates[field] !== undefined) url[field] = updates[field];
    });

    if (updates.password !== undefined) {
      if (updates.password) {
        url.password = updates.password;
        url.isPasswordProtected = true;
      } else {
        url.password = null;
        url.isPasswordProtected = false;
      }
    }

    await url.save();
    await cache.delUrl(url.shortCode);
    await cache.invalidateUserCache(userId.toString());

    return { ...url.toObject(), shortUrl: buildShortUrl(url.shortCode) };
  }

  async delete(urlId, userId) {
    const url = await Url.findOneAndDelete({ _id: urlId, user: userId });
    if (!url) throw new AppError('URL not found', 404);

    await Analytics.deleteMany({ url: urlId });
    await cache.delUrl(url.shortCode);
    await cache.invalidateUserCache(userId.toString());

    return true;
  }

  async bulkDelete(urlIds, userId) {
    const urls = await Url.find({ _id: { $in: urlIds }, user: userId });
    const codes = urls.map((u) => u.shortCode);

    await Url.deleteMany({ _id: { $in: urlIds }, user: userId });
    await Analytics.deleteMany({ url: { $in: urlIds } });

    await Promise.all(codes.map((code) => cache.delUrl(code)));
    await cache.invalidateUserCache(userId.toString());

    return { deleted: urls.length };
  }

  async toggleFavorite(urlId, userId) {
    const url = await Url.findOne({ _id: urlId, user: userId });
    if (!url) throw new AppError('URL not found', 404);
    url.isFavorite = !url.isFavorite;
    await url.save();
    return url;
  }

  async getUserDashboardStats(userId) {
    const cacheKey = cache.dashboardKey(userId.toString());
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const [totalLinks, activeLinks, expiredLinks, topLinks, recentLinks, totalClicks, todayClicks, weekClicks, monthClicks] = await Promise.all([
      Url.countDocuments({ user: userId }),
      Url.countDocuments({ user: userId, isActive: true }),
      Url.countDocuments({ user: userId, expiresAt: { $lt: new Date() } }),
      Url.find({ user: userId }).sort({ totalClicks: -1 }).limit(5).select('shortCode title originalUrl totalClicks uniqueClicks').lean(),
      Url.find({ user: userId }).sort({ createdAt: -1 }).limit(5).select('shortCode title originalUrl totalClicks createdAt').lean(),
      Analytics.countDocuments({ user: userId }),
      Analytics.countDocuments({ user: userId, clickedAt: { $gte: todayStart } }),
      Analytics.countDocuments({ user: userId, clickedAt: { $gte: weekStart } }),
      Analytics.countDocuments({ user: userId, clickedAt: { $gte: monthStart } }),
    ]);

    const stats = {
      totalLinks,
      activeLinks,
      expiredLinks,
      totalClicks,
      todayClicks,
      weekClicks,
      monthClicks,
      topLinks: topLinks.map((l) => ({ ...l, shortUrl: buildShortUrl(l.shortCode) })),
      recentLinks: recentLinks.map((l) => ({ ...l, shortUrl: buildShortUrl(l.shortCode) })),
    };

    await cache.set(cacheKey, stats, 120); // 2 min cache
    return stats;
  }

  async resolveUrl(shortCode) {
    // Check cache first
    const cached = await cache.getUrl(shortCode);
    if (cached) return cached;

    const url = await Url.findOne({ shortCode }).select('+password');
    if (!url) return null;

    // Cache it
    await cache.setUrl(shortCode, url.toObject(), 3600);
    return url;
  }

  async generateQRCode(urlId, userId) {
    const url = await Url.findOne({ _id: urlId, user: userId });
    if (!url) throw new AppError('URL not found', 404);

    const shortUrl = buildShortUrl(url.shortCode);
    const qrDataUrl = await QRCode.toDataURL(shortUrl, {
      width: 300,
      margin: 2,
      color: { dark: '#4F46E5', light: '#FFFFFF' },
    });

    url.qrCode = qrDataUrl;
    await url.save();

    return qrDataUrl;
  }
}

module.exports = new UrlService();
