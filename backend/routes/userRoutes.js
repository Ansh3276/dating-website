const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/discover', protect, userController.getDiscoverUsers);
router.get('/matches', protect, userController.getMatches);
router.post('/action', protect, userController.actionUser);
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);

module.exports = router;
