const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const feedbackSchema = new Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  feedbackDesc: {
    type: String,
    required: true,
    trim: true,
  },
}, {
    timestamps: true
});

const Feedback = Mongoose.model('feedback',feedbackSchema);

module.exports = Feedback;