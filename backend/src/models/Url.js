const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const urlSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    originalUrl: {
      type: String,
      required: [true, 'Original URL is required'],
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    customAlias: {
      type: String,
      default: null,
      trim: true,
    },
    title: {
      type: String,
      default: null,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      default: null,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    password: {
      type: String,
      default: null,
      select: false,
    },
    isPasswordProtected: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
    qrCode: {
      type: String,
      default: null,
    },
    totalClicks: {
      type: Number,
      default: 0,
    },
    uniqueClicks: {
      type: Number,
      default: 0,
    },
    tags: [{ type: String, trim: true }],
    utmSource: { type: String, default: null },
    utmMedium: { type: String, default: null },
    utmCampaign: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
urlSchema.index({ user: 1, createdAt: -1 });
urlSchema.index({ user: 1, isActive: 1 });
urlSchema.index({ shortCode: 1 });
urlSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { expiresAt: { $ne: null } } });

// Check if URL is expired
urlSchema.virtual('isExpired').get(function () {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

// Hash password before saving
urlSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.isPasswordProtected = true;
  next();
});

// Compare URL password
urlSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

urlSchema.set('toJSON', { virtuals: true });
urlSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Url', urlSchema);
