const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/admin.controller');
const { protect, requireAdmin } = require('../middlewares/auth.middleware');

router.use(protect, requireAdmin);

router.get('/stats', ctrl.getStats);
router.get('/users', ctrl.getUsers);
router.patch('/users/:id/toggle', ctrl.toggleUserStatus);
router.get('/urls', ctrl.getUrls);
router.delete('/urls/:id', ctrl.deleteUrl);

module.exports = router;
