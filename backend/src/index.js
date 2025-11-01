require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Initialize database connection and create tables
const db = require('./config');

// Create tables if they don't exist (runs once at startup)
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, password TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, startTime TEXT, endTime TEXT, status TEXT, userId INTEGER)');
  db.run('CREATE TABLE IF NOT EXISTS swap_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, requesterId INTEGER, requesteeId INTEGER, requesterEventId INTEGER, requesteeEventId INTEGER, status TEXT)');
  console.log('✅ Database tables initialized');
});

// Simple CORS - allow all origins
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/swap', require('./routes/swap'));

app.get('/', (req, res) => {
  res.json({ message: 'SlotSwapper API running' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});

