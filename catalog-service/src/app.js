const express = require('express');
const cors = require('cors');
const catalogRoutes = require('./routes/catalogRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Using /api/catalog as instructed
app.use('/api/catalog', catalogRoutes);

// Basic health check
app.get('/', (req, res) => {
  res.send('Catalog Service is running');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

module.exports = app;
