const { User } = require('../models/User');
const { Quiz } = require('../models/Quiz');

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error });
  }
};

const getUserQuizzesCreated = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.id });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quizzes', error });
  }
};

const getUserQuizzesAttempted = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      'quizzesAttempted.quiz',
      'title subject description'
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.quizzesAttempted);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attempted quizzes', error });
  }
};

const updateUserRank = async (req, res) => {
  try {
    const { rank } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.rank = rank;
    await user.save();

    res.status(200).json({ message: 'User rank updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating rank', error });
  }
};

const getUserRecentActivities = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'quizzesAttempted.quiz',  
      select: 'title questions'  
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recentActivities = user.recentActivities;

    res.status(200).json({ recentActivities });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent activities', error });
  }
};


module.exports = {
  getUserProfile,
  getUserQuizzesCreated,
  getUserQuizzesAttempted,
  updateUserRank,
  getUserRecentActivities
};

