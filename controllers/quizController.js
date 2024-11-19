const { Quiz, Question } = require('../models/Quiz');
const { User } = require('../models/User');

// Get all quizzes
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate('createdBy', 'username').exec();
    res.status(200).json({
      quizzes: quizzes.map(quiz => ({
        quizId: quiz._id,
        title: quiz.title,
        description: quiz.description,
        createdBy: quiz.createdBy.username,
        averageScore: quiz.averageScore,
      }))
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching quizzes", error: err.message });
  }
};

const createQuiz = async (req, res) => {
  const { title, description, questionIds } = req.body;
  const userId = req.user.id;

  try {
    const quiz = new Quiz({
      title,
      description,
      questions: questionIds,
      createdBy: userId,
    });

    await quiz.save();

    res.status(201).json({
      message: "Quiz created successfully",
      quizId: quiz._id,
    });
  } catch (err) {
    res.status(500).json({ message: "Error creating quiz", error: err.message });
  }
};

// Start the quiz and return all questions
const startQuiz = async (req, res) => {
  const { quizId } = req.body;

  try {
    const quiz = await Quiz.findById(quizId).populate('questions').exec();
    
    // Make sure there are questions
    if (!quiz.questions || quiz.questions.length === 0) {
      return res.status(404).json({ message: "No questions available to start the quiz" });
    }

    // Return all questions to the frontend
    res.status(200).json({
      questions: quiz.questions.map(question => ({
        questionId: question._id,
        questionText: question.questionText,
        options: question.options,
        difficulty: question.difficulty,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Error starting quiz", error: err.message });
  }
};

// Submit all answers and calculate result
const submitQuiz = async (req, res) => {
  const { quizId, answers } = req.body; // 'answers' is an array of {questionId, selectedAnswer}

  try {
    const quiz = await Quiz.findById(quizId).populate('questions').exec();

    // Calculate score based on the answers
    let score = 0;
    answers.forEach(answer => {
      const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
      if (question && question.correctAnswer === answer.selectedAnswer) {
        score += 1;
      }
    });

    // Calculate average score
    const totalScores = quiz.leaderboard.reduce((sum, entry) => sum + entry.score, 0);
    const averageScore = quiz.leaderboard.length > 0 ? totalScores / quiz.leaderboard.length : 0;

    // Save the user's score to the leaderboard
    quiz.leaderboard.push({ user: req.user.id, score });
    await quiz.save();

    // Sort the leaderboard by score
    const sortedLeaderboard = quiz.leaderboard.sort((a, b) => b.score - a.score);

    // Calculate the user's rank
    const userRank = sortedLeaderboard.findIndex(entry => entry.user.toString() === req.user.id) + 1;

    res.status(200).json({
      score,
      averageScore,
      rank: userRank,
      leaderboard: sortedLeaderboard.map(entry => ({
        user: entry.user.username,
        score: entry.score,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Error submitting quiz", error: err.message });
  }
};

const getLeaderboard = async (req, res) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId).populate('leaderboard.user').exec();
    const sortedLeaderboard = quiz.leaderboard.sort((a, b) => b.score - a.score);

    res.status(200).json({
      leaderboard: sortedLeaderboard.map(entry => ({
        user: entry.user.username,
        score: entry.score,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching leaderboard", error: err.message });
  }
};

module.exports = {
  getAllQuizzes,
  createQuiz,
  startQuiz,
  submitQuiz,
  getLeaderboard,
};
