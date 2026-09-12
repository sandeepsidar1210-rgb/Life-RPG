import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import characterRouter from './routes/character.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// CORS configuration supporting client dev URL & production deployment
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl) or matching origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Dev-friendly fallback
  },
  credentials: true,
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API Routes
app.use('/api', characterRouter);

// Root informational endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Life RPG Server API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      me: '/api/me'
    }
  });
});

app.listen(PORT, () => {
  console.log(`[Life RPG Server] Listening on http://localhost:${PORT}`);
  console.log(`[Life RPG Server] Configured Client URL: ${CLIENT_URL}`);
});
