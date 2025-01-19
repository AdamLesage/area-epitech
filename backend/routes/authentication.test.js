const request = require('supertest');
const express = require('express');
const authRouter = require('./authentication');
const userRouter = require('./user');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

require('dotenv').config();

// Setup Prisma Client
const prisma = new PrismaClient();
let app;

jest.mock('nodemailer');


beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use('/auth', authRouter);
    app.use('/api/', userRouter);

    // Clean up the database before the tests
    await prisma.user.deleteMany();
});

afterAll(async () => {
    // Clean up the database after the tests
    await prisma.$disconnect();
});

describe('Authentication Routes', () => {
    const userEmail = 'test.user@mail.com';
    const userPassword = 'testpassword123';

    it('should register a new user (POST /auth/register)', async () => {
        const response = await request(app).post('/auth/register').send({
            name: "Test",
            surname: "User",
            bio: 'Testing registration',
            birthDate: new Date().toISOString(),
            email: userEmail,
            phoneNumber: '123456789',
            password: userPassword,
        });

        expect(response.statusCode).toBe(201);
        // Expect to retrieve a user authToken and a message "User registered"
        expect(response.body).toHaveProperty('authToken');
        expect(response.body).toHaveProperty('message', 'User registered');
    });

    it('should not register a user with missing parameters (POST /auth/register)', async () => {
        const response = await request(app).post('/auth/register').send({
            email: userEmail,
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'Missing required parameters');
    });

    it('should not login a user with incorrect password (GET /auth/login)', async () => {
        const response = await request(app).post('/auth/login').send({
            email: userEmail,
            password: 'wrongpassword',
        });

        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('error', 'Invalid password');
    });


    it('should not login a user without password (GET /auth/login)', async () => {
        const response = await request(app).post('/auth/login').send({
            email: userEmail,
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'Missing parameters');
    });

    it('should not login a user with an unexisting user (GET /auth/login)', async () => {
        const response = await request(app).post('/auth/login').send({
            email: "unexisting.user@gmail.com",
            password: userPassword,
        });

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error', 'User not found');
    });

    it('should not login a non-existent user (GET /auth/login)', async () => {
        const response = await request(app).get('/auth/login').send({
            email: 'nonexistent@mail.com',
            password: 'password123',
        });

        expect(response.statusCode).toBe(404);
    });

    it('should login a user (GET /auth/login)', async () => {
        const response = await request(app).post('/auth/login').send({
            email: userEmail,
            password: userPassword,
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'User logged in');
        expect(response.body).toHaveProperty('user');
    });

    it('should not register an existing user (POST /auth/register)', async () => {
        const response = await request(app).post('/auth/register').send({
            name: "Test",
            surname: "User",
            bio: 'Testing registration',
            birthDate: new Date().toISOString(),
            email: userEmail,
            phoneNumber: '123456789',
            password: userPassword,
        });

        expect(response.statusCode).toBe(409);
        expect(response.body).toHaveProperty('error', 'User already exists');
    });

    it('should logout a user and invalidate the auth token (GET /auth/logout)', async () => {
        // Register a new user
        const registerResponse = await request(app).post('/auth/register').send({
            email: 'logout.user@mail.com',
            password: 'logoutpassword123',
        });

        expect(registerResponse.statusCode).toBe(201);
        const authToken = registerResponse.body.authToken;

        // Logout the user
        const logoutResponse = await request(app)
            .get('/auth/logout')
            .set('Authorization', authToken);

        expect(logoutResponse.statusCode).toBe(200);
        expect(logoutResponse.body).toHaveProperty('message', 'User logged out');

        // Try to logout again with the same token, should fail
        const logoutAgainResponse = await request(app)
            .get('/auth/logout')
            .set('Authorization', authToken);

        expect(logoutAgainResponse.statusCode).toBe(404);
        expect(logoutAgainResponse.body).toHaveProperty('error', 'User not found');
    });

    it('should not logout a user with missing authorization header (GET /auth/logout)', async () => {
        const response = await request(app).get('/auth/logout');

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'Missing authorization header');
    });

    it('should not logout a user with invalid authorization token (GET /auth/logout)', async () => {
        const response = await request(app)
            .get('/auth/logout')
            .set('Authorization', 'invalidtoken');

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error', 'User not found');
    });


    it('should send a reset password email (POST /auth/reset-password)', async () => {
        // Mock nodemailer
        const sendMailMock = jest.fn().mockResolvedValue({ messageId: 'testMessageId' });
        nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

        // Register a new user
        await request(app).post('/auth/register').send({
            email: userEmail,
            password: userPassword,
        });

        const response = await request(app).post('/auth/reset-password').send({
            email: userEmail,
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', `Email sent to ${userEmail}`);
        expect(sendMailMock).toHaveBeenCalled();
    });

    it('should not send a reset password email with missing parameters (POST /auth/reset-password)', async () => {
        const response = await request(app).post('/auth/reset-password').send({});

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'Missing required parameters');
    });

    it('should not send a reset password email to a non-existent user (POST /auth/reset-password)', async () => {
        const response = await request(app).post('/auth/reset-password').send({
            email: 'nonexistent@mail.com',
        });

        expect(response.statusCode).toBe(404);
        expect(response.body).toHaveProperty('error', 'User not found');
    });

    it('should not confirm reset password code with missing parameters (POST /auth/reset-password-confirm)', async () => {
        const response = await request(app).post('/auth/reset-password-confirm').send({});

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'Missing required parameters');
    });

    it('should not confirm reset password code with incorrect code (POST /auth/reset-password-confirm)', async () => {
        // Mock nodemailer
        const sendMailMock = jest.fn().mockResolvedValue({ messageId: 'testMessageId' });
        nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

        // Register a new user
        await request(app).post('/auth/register').send({
            email: userEmail,
            password: userPassword,
        });

        // Send reset password email
        await request(app).post('/auth/reset-password').send({
            email: userEmail,
        });

        const response = await request(app).post('/auth/reset-password-confirm').send({
            email: userEmail,
            code: 'wrongcode',
        });

        expect(response.statusCode).toBe(400);
        expect(response.body).toHaveProperty('error', 'Code is incorrect');
    });

    it('should redirect to frontend URL on cancel (GET /auth/cancel)', async () => {
        const response = await request(app).get('/auth/cancel');

        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe(`${process.env.FRONTEND_URL}/`);
    });
});
