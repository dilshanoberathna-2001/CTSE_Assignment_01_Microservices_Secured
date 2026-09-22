const express = require('express');
const cors = require('cors');
const watchlistRoutes = require('./routes/watchlistRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/watchlist', watchlistRoutes);

// Basic health check
app.get('/', (req, res) => {
  res.send('Watchlist Service is running');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ code: 'INTERNAL_SERVER_ERROR', message: 'Something went wrong!', error: err.message });
});

module.exports = app;
