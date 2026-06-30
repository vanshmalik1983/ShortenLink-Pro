const express = require('express');
const router = express.Router();
const { redirect } = require('../controllers/redirect.controller');
const { redirectLimiter } = require('../middlewares/rateLimiter');

// Short URL redirect – matches 3-32 character alphanumeric codes
router.get('/:code([a-zA-Z0-9_-]{3,32})', redirectLimiter, redirect);

module.exports = router;
