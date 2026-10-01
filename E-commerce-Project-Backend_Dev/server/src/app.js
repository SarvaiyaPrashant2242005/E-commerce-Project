const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const apiRoutes = require('./routes.index');
const { formatError } = require('./utils/response');

const app = express();

// Security and utility middleware
app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      // Allow all localhost origins (e.g. 5173, 5174, 3000, 127.0.0.1)
      if (/^http:\/\/localhost(:\d+)?$/.test(origin) || /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev mode to ensure seamless operation
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'ZalimaEco API', timestamp: new Date() });
});

// Mount modular API routes under /api
app.use('/api', apiRoutes);

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json(formatError(404, `Cannot ${req.method} ${req.originalUrl}`, 'NOT_FOUND'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  const status = err.statusCode || 500;
  res.status(status).json(formatError(status, err.message || 'Internal Server Error'));
});

module.exports = app;
