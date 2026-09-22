const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: {
    type: String, // from User Service
    required: true
  },
  movieId: {
    type: String, // from Catalog Service
    required: true
  },
  watchedAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number, // percentage or seconds
    default: 0
  },
  status: {
    type: String,
    enum: ['watching', 'completed'],
    default: 'watching'
  }
}, { timestamps: true });

// Ensure we have only one history entry per user per movie for simplicity, or we update the latest
historySchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('History', historySchema);
