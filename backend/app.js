const Prisma = require('@prisma/client');
const express = require('express');
const userRouter = require('./routes/user');
const app = express();
const port = 3000;

app.use(express.json());

app.use('/api', userRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
