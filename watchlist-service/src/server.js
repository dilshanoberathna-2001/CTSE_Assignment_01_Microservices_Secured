require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const swaggerDocs = require('./config/swagger');

const PORT = process.env.PORT || 5003;

// Connect to Database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Watchlist Service listening on port ${PORT}`);
    swaggerDocs(app, PORT);
  });
});
