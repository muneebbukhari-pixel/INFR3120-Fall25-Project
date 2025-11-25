const express = require('express');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "taskflowsecret123",
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

// Home Page
app.get('/', (req, res) => {
  const tasks = require('./data/tasks.json');
  res.render('index', { title: "TaskFlow", tasks });
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`TaskFlow running at http://localhost:${PORT}`));