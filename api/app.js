const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const mongoose = require('mongoose')
const crypto = require('crypto');

const passport = require('passport');
const local = require('./authStrategies/local.js');
const session = require('express-session');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth')

require("dotenv").config();

mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const sessionSecret = crypto.randomBytes(64).toString('hex');

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/', authRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT , () => {
  console.log(`Server is running on port ${PORT}`);
})

module.exports = app;
