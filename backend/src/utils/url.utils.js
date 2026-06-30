const Url = require('../models/Url');

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const CODE_LENGTH = 7;

/**
 * Generate a random short code
 */
const generateShortCode = (length = CODE_LENGTH) => {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return code;
};

/**
 * Generate a unique short code that doesn't exist in DB
 */
const generateUniqueShortCode = async () => {
  let code;
  let exists = true;
  let attempts = 0;

  while (exists && attempts < 10) {
    code = generateShortCode();
    exists = await Url.exists({ shortCode: code });
    attempts++;
  }

  if (attempts >= 10) {
    // Increase length to avoid collisions
    code = generateShortCode(CODE_LENGTH + 2);
  }

  return code;
};

/**
 * Validate URL format
 */
const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

/**
 * Validate custom alias
 */
const isValidAlias = (alias) => {
  return /^[a-zA-Z0-9-_]{3,30}$/.test(alias);
};

/**
 * Build short URL from code
 */
const buildShortUrl = (code) => {
  return `${process.env.BASE_URL || 'http://localhost:5000'}/${code}`;
};

/**
 * Extract domain from URL
 */
const extractDomain = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
};

/**
 * Sanitize URL - ensure it has protocol
 */
const sanitizeUrl = (url) => {
  if (!url) return url;
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

module.exports = {
  generateShortCode,
  generateUniqueShortCode,
  isValidUrl,
  isValidAlias,
  buildShortUrl,
  extractDomain,
  sanitizeUrl,
};
