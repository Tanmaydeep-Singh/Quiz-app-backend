const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  description: { type: String },
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String }],
      correctAnswer: { type: String, required: true },
      difficulty: { type: String, enum: ["easy", "medium", "hard"], required: true },
    },
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  totalAttempts: { type: Number, default: 0 }, // Number of times this quiz has been attempted
  averageScore: { type: Number, default: 0 }, // Average score for this quiz
});

module.exports = mongoose.model("Quiz", quizSchema);
