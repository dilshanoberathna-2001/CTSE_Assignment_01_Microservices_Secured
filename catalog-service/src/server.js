require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const swaggerDocs = require('./config/swagger');

const PORT = process.env.PORT || 5002;

// Connect to DB
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Catalog Service listening on port ${PORT}`);
    swaggerDocs(app, PORT);
  });
});
