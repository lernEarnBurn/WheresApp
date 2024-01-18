const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt')
const asyncHandler = require('express-async-handler')

const User = require('../models/user')

router.post(
  '/sign-up', asyncHandler(async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      } else {
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        });

        const result = await user.save();
        res.json(user)
      }
    });
  })
)

router.post('/log-in', passport.authenticate('local'), (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ success: true, user: req.user });
  } else {
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
});

router.get('/log-out', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json('Logged Out');
  });
});

module.exports = router;