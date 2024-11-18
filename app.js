const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());

const userRoutes = require("./routes/userRoutes");
const quizRoutes = require("./routes/quizRoutes");

app.use("/api/users", userRoutes); 
app.use("/api/quizzes", quizRoutes);

app.get("/", (req, res) => {
  res.status(200).send("Server is running successfully!");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

module.exports = app;
