const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/discover', protect, userController.getDiscoverUsers);
router.get('/matches', protect, userController.getMatches);
router.get('/pending', protect, userController.getPendingLikes);
router.get('/incoming', protect, userController.getIncomingLikes);
router.post('/action', protect, userController.actionUser);
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, upload.single('photo'), userController.updateProfile);

module.exports = router;
