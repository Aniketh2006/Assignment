const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./config'); // SQLite connection

// ✅ Use environment PORT (Render provides it)
const PORT = process.env.PORT || 3001;

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Create tables if they don't exist (runs once at startup)
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      startTime TEXT,
      endTime TEXT,
      status TEXT DEFAULT 'BUSY',
      userId INTEGER
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS swap_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      requesterId INTEGER,
      requesteeId INTEGER,
      requesterEventId INTEGER,
      requesteeEventId INTEGER,
      status TEXT DEFAULT 'PENDING'
    )
  `);
  console.log('✅ Database tables initialized');
});

// ✅ Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/swap', require('./routes/swap'));

// ✅ Root endpoint (health check)
app.get('/', (req, res) => {
  res.json({ message: 'SlotSwapper API running 🚀' });
});

// ✅ Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});
