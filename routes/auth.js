const express = require('express');
const router = express.Router();
const User = require('../models/User');

// LOGIN PAGE
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('login', { error: null });
});

// LOGIN POST
router.post('/login', async (req, res) => {
  const user = await User.validate(req.body.email, req.body.password);

  if (!user) {
    return res.render('login', { error: "Invalid email or password" });
  }

  req.session.user = user;
  res.redirect('/');
});

// REGISTER PAGE
router.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('register', { error: null });
});

// REGISTER POST
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (User.findByEmail(email)) {
    return res.render('register', { error: "Email already taken." });
  }

  const newUser = await User.create(username, email, password);
  req.session.user = newUser;

  res.redirect('/');
});

// LOGOUT
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;