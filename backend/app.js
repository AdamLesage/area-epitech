const Prisma = require('@prisma/client');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const http = require('http');
const fs = require('fs');
require('./authentication/passport');

const githubServiceRouter = require('./services/githubService')
const dropboxServiceRouter = require('./services/dropboxService')
const discordServiceRouter = require('./services/discordService')

const userRouter = require('./routes/user');
const authRouter = require('./routes/authentication');
const aboutRouter = require('./routes/about');
const actionsRouter = require('./routes/action');
const reactionRouter = require('./routes/reaction');
const actionReactionRouter = require('./routes/ActionReaction');

const cors = require('cors');
const { initServices } = require('./utils/initServices');
const { initWorkers } = require('./utils/initWorkers');
const { migrateDatabase } = require("./utils/migrateDatabase")
const { stopWorkingWorkers } = require('./utils/stopWorkingWorker');

const { discordClient } = require('./discord/app');

const app = express();
const port = 8080;

var key = fs.readFileSync(__dirname + '/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/selfsigned.crt');
var options = {
  key: key,
  cert: cert
};

discordClient.login(process.env.DISCORD_BOT_TOKEN);

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
app.use('/dropbox', dropboxServiceRouter);
app.use('/discord', discordServiceRouter);
app.use('/api', actionsRouter);
app.use('/api', reactionRouter);
app.use('/auth', authRouter);
app.use('/api', actionReactionRouter);
app.use('', aboutRouter);

var server = http.createServer(app);

server.listen(port, async () => {
  await migrateDatabase();
  initServices();
  await initWorkers();
  console.log("server starting on port : " + port)
});

process.on('SIGTERM', stopWorkingWorkers);
process.on('SIGINT', stopWorkingWorkers);