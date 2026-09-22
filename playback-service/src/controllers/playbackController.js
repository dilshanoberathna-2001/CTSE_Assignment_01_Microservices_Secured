const History = require('../models/History');
const axios = require('axios');

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:5001/api/users';
const CATALOG_SERVICE_URL = process.env.CATALOG_SERVICE_URL || 'http://localhost:5002/api/catalog';
const WATCHLIST_SERVICE_URL = process.env.WATCHLIST_SERVICE_URL || 'http://localhost:5003/api/watchlist';

exports.startPlayback = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user.userId;

    // 1. Validate User
    try {
      await axios.get(`${USER_SERVICE_URL}/validate/${userId}`);
    } catch (error) {
      return res.status(400).json({ message: 'Invalid User ID' });
    }

    // 2. Fetch Stream Info from Catalog Service
    let streamInfo;
    try {
      const response = await axios.get(`${CATALOG_SERVICE_URL}/${movieId}/stream-info`);
      streamInfo = response.data;
    } catch (error) {
      return res.status(400).json({ message: 'Invalid Movie ID or restricted content' });
    }

    // 3. Log History or update
    let history = await History.findOne({ userId, movieId });
    if (!history) {
      history = new History({
        userId,
        movieId,
        progress: 0,
        status: 'watching'
      });
    }
    history.watchedAt = Date.now();
    await history.save();

    res.json({ message: 'Playback started', streamInfo, history });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.saveHistory = async (req, res) => {
  try {
    const { movieId, progress } = req.body;
    const userId = req.user.userId;

    const history = await History.findOneAndUpdate(
      { userId, movieId },
      { progress, watchedAt: Date.now() },
      { new: true, upsert: true } // Upsert if tracking randomly begins here
    );

    res.json({ message: 'History updated', history });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const historyList = await History.find({ userId }).sort({ watchedAt: -1 });
    res.json(historyList);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getContinueWatching = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.user.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const continueList = await History.find({ userId, status: 'watching' })
      .sort({ watchedAt: -1 })
      .limit(10);
    res.json(continueList);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.completeMovie = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user.userId;

    const history = await History.findOneAndUpdate(
      { userId, movieId },
      { status: 'completed', progress: 100, watchedAt: Date.now() },
      { new: true }
    );

    // Optional: Call Watchlist to mark as watched if it's there
    try {
      const token = req.header('Authorization');
      await axios.post(`${WATCHLIST_SERVICE_URL}/status`, 
        { movieId, status: 'watched' },
        { headers: { Authorization: token } }
      );
    } catch (ignoreError) {
      // It's okay if not in watchlist or connection fails silently here
    }

    res.json({ message: 'Movie completed', history });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
