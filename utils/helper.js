module.exports = {
    calculateDifficulty(isCorrect, currentDifficulty) {
      if (isCorrect && currentDifficulty === 'medium') return 'hard';
      if (!isCorrect && currentDifficulty === 'medium') return 'easy';
      if (isCorrect && currentDifficulty === 'easy') return 'medium';
      if (!isCorrect && currentDifficulty === 'hard') return 'medium';
      return currentDifficulty;
    },
  
    async calculateAverageScore(quizId) {
      const quiz = await Quiz.findById(quizId).populate('leaderboard.user').exec();
      const totalScores = quiz.leaderboard.reduce((sum, entry) => sum + entry.score, 0);
      return totalScores / quiz.leaderboard.length || 0;
    }
  };
  