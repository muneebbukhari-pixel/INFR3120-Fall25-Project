const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');

function isLoggedIn(req, res, next) {
  if (!req.session.user) return res.redirect('/login');
  next();
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    cb(null, req.session.user.id + "." + ext);
  }
});

const upload = multer({ storage });

router.get('/', isLoggedIn, (req, res) => {
  res.render('profile', { user: req.session.user });
});

router.post('/upload', isLoggedIn, upload.single('profilePic'), async (req, res) => {
  const filename = req.file.filename;

  await User.updateProfilePic(req.session.user.id, filename);

  req.session.user.profilePic = filename;

  res.redirect('/profile');
});

module.exports = router;
