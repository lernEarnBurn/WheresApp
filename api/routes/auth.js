const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const User = require("../models/user");

require("dotenv").config();

router.post(
  "/sign-up",
  asyncHandler(async (req, res, next) => {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      } else {
        const user = new User({
          username: req.body.username,
          password: hashedPassword,
        });

        await user.save();

        const token = jwt.sign(
          { user: user },
          process.env.SECRET,
          { expiresIn: "4h" },
          { algorithm: "HS256" },
        );
        return res.json({ success: true, user: user, token: token });
      }
    });
  }),
);

router.post(
  "/log-in",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const token = jwt.sign(
        { user: req.user },
        process.env.SECRET,
        { expiresIn: "4h" },
        { algorithm: "HS256" },
      );
      return res.json({ success: true, user: req.user, token: token });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Authentication failed" });
    }
  },
);

module.exports = router;
