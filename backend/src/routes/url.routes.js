const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/url.controller');
const { protect } = require('../middlewares/auth.middleware');
const { createUrlLimiter } = require('../middlewares/rateLimiter');
const { createUrlValidator, updateUrlValidator } = require('../middlewares/validator.middleware');

router.use(protect);

router.get('/', ctrl.getUrls);
router.post('/', createUrlLimiter, createUrlValidator, ctrl.createUrl);
router.get('/stats/dashboard', ctrl.getDashboardStats);
router.delete('/bulk', ctrl.bulkDelete);

router.get('/:id', ctrl.getUrlById);
router.patch('/:id', updateUrlValidator, ctrl.updateUrl);
router.delete('/:id', ctrl.deleteUrl);
router.patch('/:id/favorite', ctrl.toggleFavorite);
router.get('/:id/qrcode', ctrl.getQRCode);

module.exports = router;
