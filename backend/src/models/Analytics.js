const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    url: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Url',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ip: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    browser: {
      name: { type: String, default: 'Unknown' },
      version: { type: String, default: null },
    },
    os: {
      name: { type: String, default: 'Unknown' },
      version: { type: String, default: null },
    },
    device: {
      type: { type: String, default: 'desktop', enum: ['desktop', 'mobile', 'tablet', 'unknown'] },
      vendor: { type: String, default: null },
      model: { type: String, default: null },
    },
    country: {
      type: String,
      default: 'Unknown',
    },
    countryCode: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    referrer: {
      type: String,
      default: null,
    },
    referrerDomain: {
      type: String,
      default: 'Direct',
    },
    isUnique: {
      type: Boolean,
      default: true,
    },
    clickedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// Indexes for analytics queries
analyticsSchema.index({ url: 1, clickedAt: -1 });
analyticsSchema.index({ user: 1, clickedAt: -1 });
analyticsSchema.index({ url: 1, 'browser.name': 1 });
analyticsSchema.index({ url: 1, 'device.type': 1 });
analyticsSchema.index({ url: 1, country: 1 });
analyticsSchema.index({ clickedAt: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
