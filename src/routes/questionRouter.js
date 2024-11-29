const express = require('express');
const { getUserQuestions, createQuestion } = require('../controllers/questionController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();


router.get('/', protect, getUserQuestions);
router.post('/create',protect, createQuestion);

module.exports = router;
