const User = require("../models/User");
const Quiz = require("../models/Quiz");

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("quizzesCreated", "title subject description")
      .populate("quizzesAttempted.quiz", "title subject description");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error });
  }
};

const getUserQuizzesCreated = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user.id });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quizzes", error });
  }
};

const getUserQuizzesAttempted = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "quizzesAttempted.quiz",
      "title subject description"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.quizzesAttempted);
  } catch (error) {
    res.status(500).json({ message: "Error fetching attempted quizzes", error });
  }
};

const updateUserRank = async (req, res) => {
  try {
    const { rank } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.rank = rank;
    await user.save();

    res.status(200).json({ message: "User rank updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating rank", error });
  }
};

module.exports = {
  createUser,
  getUserProfile,
  getUserQuizzesCreated,
  getUserQuizzesAttempted,
  updateUserRank,
};
