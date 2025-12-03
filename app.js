const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const Task = require('./models/Task');

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true
}));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret123',
    resave: false,
    saveUninitialized: false
  })
);

// User for views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', require('./routes/auth'));
app.use('/tasks', require('./routes/tasks'));
app.use('/profile', require('./routes/profile'));

// Home
app.get('/', (req, res) => {
  const tasks = Task.getAllTasks();
  res.render('index', { title: 'TaskFlow', tasks });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
