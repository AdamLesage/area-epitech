const request = require('supertest');
const express = require('express');
const authRouter = require('./authentication'); // Remplacez avec le chemin correct
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

require('dotenv').config();

// Setup Prisma Client
const prisma = new PrismaClient();
let app;

beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRouter);

    // Clean up the database before the tests
    await prisma.user.deleteMany();
});

afterAll(async () => {
    // Clean up the database after the tests
    await prisma.user.deleteMany();
    await prisma.$disconnect();
});

describe('Authentication Routes', () => {
    const userEmail = 'test.user@mail.com';
    const userPassword = 'testpassword123';

    it('should register a new user (POST /api/auth/register)', async () => {
        const response = await request(app).post('/api/auth/register').send({
            name: "Test",
            surname: "User",
            bio: 'Testing registration',
            birthDate: new Date().toISOString(),
            email: userEmail,
            phoneNumber: '123456789',
            password: userPassword,
        });

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('email', userEmail);
        expect(response.body).toHaveProperty('name', 'Test');
    });

    it('should not register a user with missing parameters (POST /api/auth/register)', async () => {
        const response = await request(app).post('/api/auth/register').send({
            email: userEmail,
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'Missing required parameters');
    });

    it('should not login a user with incorrect password (GET /api/auth/login)', async () => {
        const response = await request(app).get('/api/auth/login').send({
            email: userEmail,
            password: 'wrongpassword',
        });

        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('error', 'Invalid password');
    });

    it('should not login a non-existent user (GET /api/auth/login)', async () => {
        const response = await request(app).get('/api/auth/login').send({
            email: 'nonexistent@mail.com',
            password: 'password123',
        });

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error', 'User not found');
    });
});