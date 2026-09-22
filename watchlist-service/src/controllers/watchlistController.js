const Watchlist = require('../models/Watchlist');
const axios = require('axios');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:5001/api/users';
const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || 'http://localhost:5002/api/catalog';
const VALID_STATUSES = ['saved', 'watched'];

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const sendError = (res, status, code, message) => {
  return res.status(status).json({ code, message });
};

exports.addToWatchlist = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user.userId; // From auth middleware

    if (!isNonEmptyString(userId)) {
      return sendError(res, 400, 'INVALID_USER_ID', 'Invalid User ID');
    }

    if (!isNonEmptyString(movieId)) {
      return sendError(res, 400, 'INVALID_MOVIE_ID', 'Invalid Movie ID');
    }

    // 1. Validate User via User Service
    try {
      await axios.get(`${USER_SERVICE_URL}/validate/${userId}`);
    } catch (error) {
      return sendError(res, 400, 'INVALID_USER_ID', 'Invalid User ID');
    }

    // 2. Validate Movie via Catalog Service
    try {
      await axios.get(`${CATALOG_SERVICE_URL}/${movieId}`);
    } catch (error) {
      return sendError(res, 400, 'INVALID_MOVIE_ID', 'Invalid Movie ID');
    }

    // 3. Add to Watchlist
    const existingEntry = await Watchlist.findOne({ userId, movieId });
    if (existingEntry) {
      return sendError(res, 400, 'DUPLICATE_WATCHLIST_ITEM', 'Movie already in watchlist');
    }

    const newWatchlistEntry = new Watchlist({
      userId,
      movieId,
      status: 'saved'
    });

    await newWatchlistEntry.save();
    res.status(201).json({ message: 'Added to watchlist', item: newWatchlistEntry });
  } catch (error) {
    return sendError(res, 500, 'INTERNAL_SERVER_ERROR', 'Server error');
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    const { userId, movieId } = req.params;

    if (!isNonEmptyString(userId)) {
      return sendError(res, 400, 'INVALID_USER_ID', 'Invalid User ID');
    }

    if (!isNonEmptyString(movieId)) {
      return sendError(res, 400, 'INVALID_MOVIE_ID', 'Invalid Movie ID');
    }
    
    // Ensure the current authenticated user is modifying their own watchlist
    if (req.user.userId !== userId && req.user.role !== 'admin') {
      return sendError(res, 403, 'FORBIDDEN', 'Not authorized to modify this watchlist');
    }

    await Watchlist.findOneAndDelete({ userId, movieId });
    res.json({ message: 'Removed from watchlist' });
  } catch (error) {
    return sendError(res, 500, 'INTERNAL_SERVER_ERROR', 'Server error');
  }
};

exports.getUserWatchlist = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isNonEmptyString(userId)) {
      return sendError(res, 400, 'INVALID_USER_ID', 'Invalid User ID');
    }

    const watchlist = await Watchlist.find({ userId });
    
    // In a more complex system, we might fetch movie details from Catalog Service here.
    // To keep it simple, we just return the watchlist items.
    
    res.json(watchlist);
  } catch (error) {
    return sendError(res, 500, 'INTERNAL_SERVER_ERROR', 'Server error');
  }
};

exports.checkIfSaved = async (req, res) => {
  try {
    const { userId, movieId } = req.params;

    if (!isNonEmptyString(userId)) {
      return sendError(res, 400, 'INVALID_USER_ID', 'Invalid User ID');
    }

    if (!isNonEmptyString(movieId)) {
      return sendError(res, 400, 'INVALID_MOVIE_ID', 'Invalid Movie ID');
    }

    const entry = await Watchlist.findOne({ userId, movieId });
    if (entry) {
      return res.json({ isSaved: true, status: entry.status });
    }
    res.json({ isSaved: false });
  } catch (error) {
    return sendError(res, 500, 'INTERNAL_SERVER_ERROR', 'Server error');
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { movieId, status } = req.body;
    const userId = req.user.userId;

    if (!isNonEmptyString(userId)) {
      return sendError(res, 400, 'INVALID_USER_ID', 'Invalid User ID');
    }

    if (!isNonEmptyString(movieId)) {
      return sendError(res, 400, 'INVALID_MOVIE_ID', 'Invalid Movie ID');
    }

    if (!VALID_STATUSES.includes(status)) {
      return sendError(res, 400, 'INVALID_STATUS', 'Invalid status');
    }

    const updatedEntry = await Watchlist.findOneAndUpdate(
      { userId, movieId },
      { status },
      { new: true }
    );

    if (!updatedEntry) {
      return sendError(res, 404, 'WATCHLIST_ITEM_NOT_FOUND', 'Item not found in watchlist');
    }

    res.json({ message: 'Status updated', item: updatedEntry });
  } catch (error) {
    return sendError(res, 500, 'INTERNAL_SERVER_ERROR', 'Server error');
  }
};
