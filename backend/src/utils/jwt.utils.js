const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { RefreshToken } = require('../models/Token');

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
};

const generateRefreshToken = () => {
  return uuidv4();
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const saveRefreshToken = async (userId, token, rememberMe = false) => {
  const expiryDays = rememberMe ? 30 : 7;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiryDays);

  await RefreshToken.create({
    user: userId,
    token,
    expiresAt,
  });
};

const revokeRefreshToken = async (token) => {
  await RefreshToken.deleteOne({ token });
};

const revokeAllUserTokens = async (userId) => {
  await RefreshToken.deleteMany({ user: userId });
};

const findRefreshToken = async (token) => {
  return RefreshToken.findOne({ token, expiresAt: { $gt: new Date() } });
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  saveRefreshToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  findRefreshToken,
};
