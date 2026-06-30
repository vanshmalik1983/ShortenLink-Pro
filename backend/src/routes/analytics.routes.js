// analytics.routes.js
const express = require('express');
const analyticsRouter = express.Router();
const analyticsCtrl = require('../controllers/analytics.controller');
const { protect } = require('../middlewares/auth.middleware');

analyticsRouter.use(protect);
analyticsRouter.get('/overview', analyticsCtrl.getOverviewAnalytics);
analyticsRouter.get('/:urlId', analyticsCtrl.getUrlAnalytics);

module.exports = analyticsRouter;
