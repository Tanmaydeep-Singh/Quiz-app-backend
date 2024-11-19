const { Question } = require('../models/Quiz');

const getUserQuestions = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const questions = await Question.find({ createdBy: userId });
  
      if (!questions || questions.length === 0) {
        return res.status(404).json({ message: 'No questions found for this user' });
      }
  
      res.status(200).json(questions);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching questions', error: error.message });
    }
  };

const createQuestion =  async (req, res) => {
    const { questionText, options, correctAnswer, difficulty, subject } = req.body;
    const userId = req.user.id;

  
    try {
      const newQuestion = new Question({
        questionText,
        options,
        correctAnswer,
        difficulty,
        subject,
        createdBy:userId,
      });
  
      await newQuestion.save();
      res.status(201).json({
        message: "Question created successfully",
        questionId: newQuestion._id,
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating question", error: error.message });
    }
  }

  module.exports= {
    getUserQuestions,
    createQuestion
  }