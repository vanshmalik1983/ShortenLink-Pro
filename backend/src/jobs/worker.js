require("dotenv").config();

const { Worker } = require("bullmq");
const IORedis = require("ioredis");
const QRCode = require("qrcode");

const { connectDB } = require("../database/connection");
const { sendEmail } = require("../config/email");
const Url = require("../models/Url");
const Analytics = require("../models/Analytics");
const logger = require("../config/logger");

// Create Redis connection
const connection = process.env.REDIS_URL
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

// Connection Events
connection.on("connect", () => {
  logger.info("✅ Worker Redis connected");
});

connection.on("ready", () => {
  logger.info("✅ Worker Redis ready");
});

connection.on("error", (err) => {
  logger.error(`Worker Redis Error: ${err.message}`);
});

// =======================
// QR Code Worker
// =======================
const qrWorker = new Worker(
  "qr-generation",
  async (job) => {
    const { urlId, shortUrl } = job.data;

    logger.info(`Generating QR code for ${urlId}`);

    const qrDataUrl = await QRCode.toDataURL(shortUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#4F46E5",
        light: "#FFFFFF",
      },
    });

    await Url.findByIdAndUpdate(urlId, {
      qrCode: qrDataUrl,
    });

    logger.info(`QR code generated for ${urlId}`);
  },
  { connection }
);

// =======================
// Email Worker
// =======================
const emailWorker = new Worker(
  "email-sending",
  async (job) => {
    const { to, subject, html, text } = job.data;

    logger.info(`Sending email to ${to}`);

    await sendEmail({
      to,
      subject,
      html,
      text,
    });

    logger.info(`Email sent to ${to}`);
  },
  { connection }
);

// =======================
// Cleanup Worker
// =======================
const cleanupWorker = new Worker(
  "cleanup",
  async () => {
    logger.info("Running cleanup...");

    const result = await Url.updateMany(
      {
        expiresAt: { $lt: new Date() },
        isActive: true,
      },
      {
        isActive: false,
      }
    );

    logger.info(`Deactivated ${result.modifiedCount} URLs`);
  },
  { connection }
);

// =======================
// Analytics Worker
// =======================
const analyticsWorker = new Worker(
  "analytics",
  async (job) => {
    const { urlId, userId, analyticsData } = job.data;

    await Analytics.create({
      url: urlId,
      user: userId,
      ...analyticsData,
    });

    await Url.findByIdAndUpdate(urlId, {
      $inc: {
        totalClicks: 1,
      },
    });
  },
  { connection }
);

// Worker Events
[qrWorker, emailWorker, cleanupWorker, analyticsWorker].forEach((worker) => {
  worker.on("completed", (job) => {
    logger.info(`✅ Job ${job.id} completed (${job.queueName})`);
  });

  worker.on("failed", (job, err) => {
    logger.error(
      `❌ Job ${job?.id} failed (${job?.queueName}): ${err.message}`
    );
  });

  worker.on("error", (err) => {
    logger.error(`Worker Error: ${err.message}`);
  });
});

// Start
async function startWorkers() {
  try {
    await connectDB();

    logger.info("🚀 BullMQ Workers Started");
  } catch (err) {
    logger.error(`Worker startup failed: ${err.message}`);
    process.exit(1);
  }
}

startWorkers();