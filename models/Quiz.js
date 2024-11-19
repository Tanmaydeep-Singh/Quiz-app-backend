const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    questionText: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    topic: { type: String },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,  
    },
  },
  { timestamps: true }
);

const Question = mongoose.model('Question', questionSchema);

const quizSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }], 
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    averageScore: { type: Number, default: 0 }, 
    leaderboard: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        score: { type: Number },
      },
    ], // Track user score for the leaderboard
  },
  { timestamps: true }
);

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = { Quiz, Question };
