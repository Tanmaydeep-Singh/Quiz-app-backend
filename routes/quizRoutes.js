const express = require("express");
const { getAllQuizzes, createQuiz } = require("../controllers/quizController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/", protect, getAllQuizzes);
router.post("/", protect, createQuiz);

module.exports = router;
