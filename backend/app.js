const Prisma = require('@prisma/client');
const express = require('express');
const routes = require('./routes/action.js');
const prisma = new Prisma.PrismaClient;
const app = express();
const port = 3000;

app.use(express.json());

routes.setup(app);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});