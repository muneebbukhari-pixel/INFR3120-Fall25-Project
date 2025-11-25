const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Middleware to protect routes
function isLoggedIn(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

// ADD FORM
router.get('/add', isLoggedIn, (req, res) => {
  res.render('addTask');
});

// ADD POST
router.post('/add', isLoggedIn, (req, res) => {
  Task.addTask(req.body);
  res.redirect('/');
});

// EDIT FORM
router.get('/edit/:id', isLoggedIn, (req, res) => {
  const task = Task.getTask(req.params.id);
  res.render('editTask', { task });
});

// EDIT POST
router.post('/edit/:id', isLoggedIn, (req, res) => {
  Task.updateTask(req.params.id, req.body);
  res.redirect('/');
});

// DELETE
router.get('/delete/:id', isLoggedIn, (req, res) => {
  Task.deleteTask(req.params.id);
  res.redirect('/');
});

module.exports = router;
