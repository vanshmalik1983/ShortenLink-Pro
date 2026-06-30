const { Queue } = require("bullmq");
const IORedis = require("ioredis");
const logger = require("../config/logger");

let queues = {};
let connection = null;

// Create a single shared Redis connection
const getConnection = () => {
  if (connection) return connection;

  connection = process.env.REDIS_URL
    ? new IORedis(process.env.REDIS_URL, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
      })
    : new IORedis({
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: null,
      });

  connection.on("connect", () => {
    logger.info("✅ Queue Redis connected");
  });

  connection.on("ready", () => {
    logger.info("✅ Queue Redis ready");
  });

  connection.on("error", (err) => {
    logger.error(`Queue Redis Error: ${err.message}`);
  });

  return connection;
};

const getQueue = (name) => {
  if (!queues[name]) {
    queues[name] = new Queue(name, {
      connection: getConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 1000,
        },
        removeOnComplete: 100,
        removeOnFail: 200,
      },
    });
  }

  return queues[name];
};

const addToQueue = async (queueName, data, options = {}) => {
  try {
    const queue = getQueue(queueName);
    return await queue.add(queueName, data, options);
  } catch (err) {
    logger.error(`Queue ${queueName} error: ${err.message}`);
    return null;
  }
};

module.exports = {
  getQueue,
  addToQueue,
};