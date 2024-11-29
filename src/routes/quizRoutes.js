const express = require('express');
const {
  createQuiz,
  getAllQuizzes,
  startQuiz,
  submitQuiz,
  getLeaderboard,
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllQuizzes);

router.post('/create', protect, createQuiz);

router.post('/start', protect, startQuiz);

router.post('/:quizId/submit', protect, submitQuiz);

router.get('/:quizId/leaderboard', getLeaderboard);

module.exports = router;
