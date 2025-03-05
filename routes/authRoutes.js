const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config();
const { User } = require('../models/User');

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

// Register route (POST)
router.post('/register', async (req, res) => {
    const { username, password, confirmPassword } = req.body;
  
    if (!username || !password || !confirmPassword) {
        return res.status(400).json({ error: 'Username, password, and confirm password are required' });
    }
  
    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }  // ✅ Now it doesn't always return early.
  
    try {
        const existingUser = await User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, password: hashedPassword });
  
        res.status(201).json({ message: 'Registration successful. Please log in.' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

  

// Login route (POST)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
      const user = await User.findOne({ where: { username } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 3600000
      });

      res.status(200).json({ message: 'Login successful', redirectUrl: '/dashboard' });
  } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;