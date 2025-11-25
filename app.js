const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();

const Task = require('./models/Task');

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret123',
    resave: false,
    saveUninitialized: false
  })
);

// Make user available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', require('./routes/auth'));
app.use('/tasks', require('./routes/tasks'));

// Home: show tasks (only if logged in)
app.get('/', (req, res) => {
  const tasks = Task.getAllTasks();
  res.render('index', { title: 'TaskFlow', tasks });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));
