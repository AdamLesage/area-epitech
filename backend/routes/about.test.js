const request = require('supertest');
const express = require('express');
const AboutRouter = require('./about');
const { PrismaClient } = require('@prisma/client');

require('dotenv').config();

// Setup Prisma Client
const prisma = new PrismaClient();
let app;

beforeAll(async () => {
    // Setup the express app and routes
    app = express();
    app.use(express.json());
    app.use('', AboutRouter);
});


describe('User Routes', () => {
    it('should create a new user', async () => {
        const response = await request(app).get('/about.json');
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('client');
        expect(response.body).toHaveProperty('server');;
    }, 10000);
});