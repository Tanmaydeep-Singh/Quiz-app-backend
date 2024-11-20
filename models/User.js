const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    quizzesAttempted: [{ type: Schema.Types.ObjectId, ref: 'Quiz' }],
    totalScore: { type: Number, default: 0 },
    recentActivities: [
      {
        quiz: { type: Schema.Types.ObjectId, ref: 'Quiz' }, 
        title: {type:String},
        score: { type: Number },  
        attemptedAt: { type: Date, default: Date.now },
      }
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = { User };
