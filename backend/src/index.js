require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Initialize database
const db = require('./config');
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, startTime TEXT, endTime TEXT, status TEXT, userId INTEGER)');
  db.run('CREATE TABLE IF NOT EXISTS swap_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, requesterId INTEGER, requesteeId INTEGER, requesterEventId INTEGER, requesteeEventId INTEGER, status TEXT)');
});

// CORS with environment variable for frontend URL
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL || 'https://your-frontend.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/swap', require('./routes/swap'));

app.get('/', (req, res) => {
  res.json({ message: 'SlotSwapper API running', status: 'healthy' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
