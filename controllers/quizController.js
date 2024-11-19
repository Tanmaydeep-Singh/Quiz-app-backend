const { Quiz, Question } = require('../models/Quiz');
const { User } = require('../models/User');

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
  const { quizId, userId } = req.body;

  try {
    const quiz = await Quiz.findById(quizId).populate('questions').exec();
    const question = quiz.questions[0];

    res.status(200).json({
      questionId: question._id,
      questionText: question.questionText,
      options: question.options,
      difficulty: question.difficulty,
    });
  } catch (err) {
    res.status(500).json({ message: "Error starting quiz", error: err.message });
  }
};

const submitAnswer = async (req, res) => {
  const { quizId, userId, questionId, selectedAnswer } = req.body;

  try {
    const quiz = await Quiz.findById(quizId).populate('questions').exec();
    const question = quiz.questions.find(q => q._id.toString() === questionId);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const isCorrect = selectedAnswer === question.correctAnswer;

    const newDifficulty = isCorrect ? 'hard' : 'easy';
    
    let user = await User.findById(userId);
    user.totalScore += isCorrect ? 1 : 0;
    await user.save();

    const leaderboardUpdate = {
      user: userId,
      score: user.totalScore,
    };

    await Quiz.findByIdAndUpdate(quizId, {
      $push: { leaderboard: leaderboardUpdate },
      $set: { averageScore: calculateAverageScore(quizId) }, 
    });

    const nextQuestion = quiz.questions.find(q => q.difficulty === newDifficulty);

    res.status(200).json({
      nextQuestionId: nextQuestion._id,
      nextQuestionText: nextQuestion.questionText,
      options: nextQuestion.options,
      difficulty: nextQuestion.difficulty,
      score: isCorrect ? 1 : 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Error submitting answer", error: err.message });
  }
};

const getLeaderboard = async (req, res) => {
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId).populate('leaderboard.user').exec();

    const sortedLeaderboard = quiz.leaderboard.sort((a, b) => b.score - a.score);

    res.status(200).json({
      leaderboard: sortedLeaderboard.map(entry => ({
        user: entry.user.name,
        score: entry.score,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching leaderboard", error: err.message });
  }
};

const calculateAverageScore = async (quizId) => {
  const quiz = await Quiz.findById(quizId).populate('leaderboard.user').exec();
  const totalScores = quiz.leaderboard.reduce((sum, entry) => sum + entry.score, 0);
  return totalScores / quiz.leaderboard.length || 0;
};


module.exports = {
  getAllQuizzes,
  createQuiz,
  startQuiz,
  submitAnswer,
  getLeaderboard
};
