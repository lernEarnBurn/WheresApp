const express = require('express');
const router = express.Router();

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

router.get('/', ensureAuthenticated, function(req, res, next) {
  res.json('test');
});

module.exports = router;
