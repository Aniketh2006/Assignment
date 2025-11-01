const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { user } = require('../models');
const SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';

router.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  
  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error('Hash error:', err);
      return res.status(500).json({ error: 'Error hashing password' });
    }
    
    user.createUser(name, email, hash, function (err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(400).json({ error: 'Email already exists' });
      }
      console.log('✅ User created:', email);
      res.json({ success: true, message: 'User created successfully' });
    });
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  user.findByEmail(email, (err, u) => {
    if (err || !u) {
      console.error('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    bcrypt.compare(password, u.password, (err, ok) => {
      if (err || !ok) {
        console.error('Password mismatch for:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign({ id: u.id, email: u.email, name: u.name }, SECRET, { expiresIn: '7d' });
      console.log('✅ User logged in:', email);
      
      // Send user data along with token
      res.json({ 
        token, 
        user: { 
          id: u.id, 
          name: u.name, 
          email: u.email 
        } 
      });
    });
  });
});

module.exports = router;

