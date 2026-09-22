const express = require('express');
const cors = require('cors');
const playbackRoutes = require('./routes/playbackRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/playback', playbackRoutes);

// Basic health check
app.get('/', (req, res) => {
  res.send('Playback Service is running');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

module.exports = app;
