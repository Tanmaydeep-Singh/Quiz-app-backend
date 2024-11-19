const express = require('express');
const { 
  getUserProfile, 
  getUserQuizzesCreated, 
  getUserQuizzesAttempted, 
  updateUserRank 
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.get('/quizzes-created', protect, getUserQuizzesCreated);
router.get('/quizzes-attempted', protect, getUserQuizzesAttempted);
router.put('/update-rank', protect, updateUserRank);

module.exports = router;
