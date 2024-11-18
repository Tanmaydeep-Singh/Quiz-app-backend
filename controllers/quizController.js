const Quiz = require("../models/Quiz");

const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("createdBy", "username");
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quizzes", error });
  }
};

const createQuiz = async (req, res) => {
  try {
    const quiz = new Quiz({ ...req.body, createdBy: req.user.id });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: "Error creating quiz", error });
  }
};

module.exports = { getAllQuizzes, createQuiz };
