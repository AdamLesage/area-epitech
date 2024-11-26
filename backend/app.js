const Prisma = require('@prisma/client');
const express = require('express');
const actionRoute = require('./routes/action.js');
const userRoute = require('./routes/user.js');
const app = express();
const port = 3000;

app.use(express.json());

actionRoute.setup(app);
userRoute.setup(app);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});