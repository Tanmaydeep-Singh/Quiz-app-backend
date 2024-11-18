const express = require("express");
const {
  createUser,
  getUserProfile,
  getUserQuizzesCreated,
  getUserQuizzesAttempted,
  updateUserRank,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", createUser); 
router.get("/profile", protect, getUserProfile);
router.get("/quizzes-created", protect, getUserQuizzesCreated);
router.get("/quizzes-attempted", protect, getUserQuizzesAttempted);
router.put("/update-rank", protect, updateUserRank);

module.exports = router;
