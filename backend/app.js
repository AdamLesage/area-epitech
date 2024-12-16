const Prisma = require('@prisma/client');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./authentication/passport');

const githubServiceRouter = require('./services/githubService')
const userRouter = require('./routes/user');
const authRouter = require('./routes/authentication');
const aboutRouter = require('./routes/about');
const actionsRouter = require('./routes/action');
const reactionRouter = require('./routes/reaction');
const actionReactionRouter = require('./routes/ActionReaction');

const cors = require('cors');
const { initServices } = require('./initServices/initServices');

const app = express();
const port = 8080;

app.use(cors());
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
app.use('/github', githubServiceRouter);
app.use('/api', actionsRouter);
app.use('/api', reactionRouter);
app.use('/auth', authRouter);
app.use('/api', actionReactionRouter);
app.use('', aboutRouter);

app.listen(port, () => {
  // Init database to store every action/reaction in the db, if they do not exists
  initServices();
  console.log(`Listening on port ${port}`);
});
