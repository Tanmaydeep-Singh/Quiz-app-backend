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

const startQuiz = async (req, res) => {
  const { quizId } = req.body;
  const userId = req.user.id;
  try {
    const quiz = await Quiz.findById(quizId).populate('questions').exec();

    if (!quiz.questions || quiz.questions.length === 0) {
      return res.status(404).json({ message: "No questions available to start the quiz" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.quizzesAttempted.push(quizId);

    await user.save();

    res.status(200).json({
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions.map((question) => ({
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


const submitQuiz = async (req, res) => {
  const { quizId, answers } = req.body; 

  try {
    const quiz = await Quiz.findById(quizId).populate('questions').exec();

    let score = 0;
    answers.forEach(answer => {
      const question = quiz.questions.find(q => q._id.toString() === answer.questionId);
      if (question && question.correctAnswer === answer.selectedAnswer) {
        score += 1;
      }
    });

    const scorePercentage = (score / quiz.questions.length) * 100;

    quiz.leaderboard.push({ user: req.user.id, score });
    await quiz.save();

    const sortedLeaderboard = quiz.leaderboard.sort((a, b) => b.score - a.score);

    const userRank = sortedLeaderboard.findIndex(entry => entry.user.toString() === req.user.id) + 1;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.recentActivities.push({
      quiz: quiz._id,
      title: quiz.title,
      score: scorePercentage,
      attemptedAt: new Date(),
    });
    await user.save();

    res.status(200).json({
      score: scorePercentage,  
      averageScore: (quiz.leaderboard.reduce((sum, entry) => sum + entry.score, 0) / quiz.leaderboard.length) || 0,
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
