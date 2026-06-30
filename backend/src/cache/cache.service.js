const { getRedis } = require('../config/redis');
const logger = require('../config/logger');

const DEFAULT_TTL = 300; // 5 minutes

class CacheService {
  get client() {
    return getRedis();
  }

  async get(key) {
    if (!this.client) return null;
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      logger.error(`Cache GET error [${key}]:`, err.message);
      return null;
    }
  }

  async set(key, value, ttl = DEFAULT_TTL) {
    if (!this.client) return false;
    try {
      await this.client.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (err) {
      logger.error(`Cache SET error [${key}]:`, err.message);
      return false;
    }
  }

  async del(key) {
    if (!this.client) return false;
    try {
      await this.client.del(key);
      return true;
    } catch (err) {
      logger.error(`Cache DEL error [${key}]:`, err.message);
      return false;
    }
  }

  async delPattern(pattern) {
    if (!this.client) return false;
    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(...keys);
      }
      return true;
    } catch (err) {
      logger.error(`Cache DEL PATTERN error [${pattern}]:`, err.message);
      return false;
    }
  }

  async exists(key) {
    if (!this.client) return false;
    try {
      return (await this.client.exists(key)) === 1;
    } catch {
      return false;
    }
  }

  // URL-specific cache methods
  urlKey = (shortCode) => `url:${shortCode}`;
  dashboardKey = (userId) => `dashboard:${userId}`;
  analyticsKey = (urlId, period) => `analytics:${urlId}:${period}`;
  userUrlsKey = (userId, page, limit) => `urls:${userId}:${page}:${limit}`;

  async getUrl(shortCode) {
    return this.get(this.urlKey(shortCode));
  }

  async setUrl(shortCode, urlData, ttl = 3600) {
    return this.set(this.urlKey(shortCode), urlData, ttl);
  }

  async delUrl(shortCode) {
    return this.del(this.urlKey(shortCode));
  }

  async invalidateUserCache(userId) {
    await this.del(this.dashboardKey(userId));
    await this.delPattern(`urls:${userId}:*`);
    await this.delPattern(`analytics:*`);
  }
}

module.exports = new CacheService();
