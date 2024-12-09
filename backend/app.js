const Prisma = require('@prisma/client');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./authentication/passport');

const googleServiceRouter = require('./services/githubService')
const userRouter = require('./routes/user');
const authRouter = require('./routes/authentication');
const aboutRouter = require('./routes/about')

const app = express();
const port = 8080;

app.use(express.json());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: 'session secret',
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', userRouter);
app.use('/github', googleServiceRouter);
app.use('/auth', authRouter);
app.use('', aboutRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
