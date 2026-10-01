require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/dbConnection');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB Atlas (ZalimaEco)
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 ZalimaEco API Server running on http://localhost:${PORT}`);
      console.log(`📡 Healthcheck available at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
