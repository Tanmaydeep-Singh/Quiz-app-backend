const express = require('express');
const {
  getAllQuizzes,
  createQuiz,
  startQuiz,
  submitAnswer,
  getLeaderboard,
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllQuizzes);

router.post('/create', protect, createQuiz);

router.post('/start', protect, startQuiz);

router.post('/:quizId/answer', protect, submitAnswer);

router.get('/:quizId/leaderboard', getLeaderboard);

module.exports = router;
