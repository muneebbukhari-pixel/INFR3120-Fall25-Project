const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.validate(email, password);

    if (!user) {
      return res.render('login', { error: 'Invalid email or password' });
    }

    req.session.user = user;
    res.redirect('/');
  } catch {
    res.render('login', { error: 'Something went wrong. Try again.' });
  }
});

router.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('register', { error: null });
});

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const exists = await User.findByEmail(email);
    if (exists) {
      return res.render('register', { error: 'Email already exists' });
    }

    const newUser = await User.create(username, email, password);
    req.session.user = newUser;

    res.redirect('/');
  } catch {
    res.render('register', { error: 'Something went wrong. Try again.' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
