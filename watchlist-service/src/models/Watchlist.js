const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: String, // String because it references another service's DB
    required: true
  },
  movieId: {
    type: String, // String because it references another service's DB
    required: true
  },
  status: {
    type: String,
    enum: ['saved', 'watched'],
    default: 'saved'
  }
}, { timestamps: true });

// Ensure user can't have duplicate movies in their watchlist
watchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

module.exports = mongoose.model('Watchlist', watchlistSchema);
