const Redis = require("ioredis");
const logger = require("./logger");

let redisClient = null;

const connectRedis = async () => {
  try {
    if (process.env.REDIS_URL) {
      redisClient = new Redis(process.env.REDIS_URL, {
        lazyConnect: true,
        maxRetriesPerRequest: null,
      });
    } else {
      redisClient = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
        tls:
          process.env.REDIS_HOST &&
          process.env.REDIS_HOST !== "localhost"
            ? {}
            : undefined,
        lazyConnect: true,
        maxRetriesPerRequest: null,
      });
    }

    redisClient.on("connect", () => logger.info("✅ Redis connected"));
    redisClient.on("ready", () => logger.info("✅ Redis ready"));
    redisClient.on("error", (err) => {
      logger.error(`Redis error: ${err.message}`);
    });

    redisClient.on("close", () => {
      logger.warn("Redis connection closed");
    });

    redisClient.on("reconnecting", () => {
      logger.warn("Redis reconnecting...");
    });

    await redisClient.connect();

    return redisClient;
  } catch (err) {
    logger.warn(`Redis unavailable: ${err.message}`);
    redisClient = null;
    return null;
  }
};

const getRedis = () => redisClient;

module.exports = { connectRedis, getRedis };