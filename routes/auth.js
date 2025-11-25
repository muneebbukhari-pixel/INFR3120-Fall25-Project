const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Login page
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('login', { error: null });
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.validate(email, password);

    if (!user) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    req.session.user = user;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Something went wrong. Try again.' });
  }
});

// Register page
router.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('register', { error: null });
});

// Register user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.render('register', { error: 'Email already exists' });
    }

    const newUser = await User.create(username, email, password);
    req.session.user = newUser;

    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('register', { error: 'Something went wrong. Try again.' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
