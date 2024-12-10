const request = require('supertest');
const express = require('express');
const authRouter = require('./authentication');
const userRouter = require('./user');
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
    app.use('/api/', userRouter);

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

    it('should logout a user and change its auth token (GET /api/auth/logout)', async () => {
        const responseUser = await request(app).post('/api/user').send({
            name: "Jhon",
            surname: "Doe",
            bio: 'I am a user',
            birthDate: new Date().toISOString(),
            email: "john.doe@mail.com",
            phoneNumber: '123456789',
            password: 'password123',
        });

        expect(responseUser.statusCode).toBe(200);
        expect(responseUser.body).toHaveProperty('uuid');
        expect(responseUser.body).toHaveProperty('email');
        expect(responseUser.body).toHaveProperty('name');
        let userAuthToken = responseUser.body.authToken;
        let userUuid = responseUser.body.uuid;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `${userAuthToken}`
        };
        const responseLogout = await request(app)
            .get('/api/auth/logout')
            .set(headers);

        expect(responseLogout.statusCode).toBe(200);
        expect(responseLogout.body).toHaveProperty('message', 'User logged out');

        // User with uuid should not have the same auth token
        const responseUserAfterLogout = await request(app)
            .get(`/api/user/${userUuid}`)
            .set(headers);

        expect(responseUserAfterLogout.statusCode).toBe(401);
        expect(responseUserAfterLogout.body).toHaveProperty('error', 'Unauthorized');

        // delete all users
        await prisma.user.deleteMany();
    });

    // it('should not send an email if email is invalid (POST /api/auth/reset-password)', async () => {
    //     const responseUser = await request(app).post('/api/user').send({
    //         name: "Jhon",
    //         surname: "Doe",
    //         bio: 'I am a user',
    //         birthDate: new Date().toISOString(),
    //         email: "john.doe@mail.com",
    //         phoneNumber: '123456789',
    //         password: 'password123',
    //     });
    //     expect(responseUser.statusCode).toBe(200);
    //     let userAuthToken = responseUser.body.authToken;
    //     console.log(userAuthToken);

    //     const headers = {
    //         'Content-Type': 'application/json',
    //         'Authorization': `${userAuthToken}`
    //     };

    //     const response = await request(app)
    //         .post('/api/auth/reset-password')
    //         .set(headers)
    //         .send({ email: 'invalidemail' });

    //     expect(response.statusCode).toBe(404);
    //     expect(response.body).toHaveProperty('error', 'User not found');

    //     // delete all users
    //     await prisma.user.deleteMany();
    // });

    // it('should send an email to reset password (POST /api/auth/reset-password)', async () => {
    //     const responseUser = await request(app).post('/api/user').send({
    //         name: "Jhon",
    //         surname: "Doe",
    //         bio: 'I am a user',
    //         birthDate: new Date().toISOString(),
    //         email: "john.doe@mail.com",
    //         phoneNumber: '123456789',
    //         password: 'password123',
    //     });
    //     expect(responseUser.statusCode).toBe(200);
    //     let userAuthToken = responseUser.body.authToken;

    //     const headers = {
    //         'Content-Type': 'application/json',
    //         'Authorization': `${userAuthToken}`
    //     };

    //     const response = await request(app)
    //         .post('/api/auth/reset-password')
    //         .set(headers)
    //         .send({ email: 'john.doe@mail.com' });

    //     expect(response.statusCode).toBe(200);
    //     expect(response.body).toHaveProperty('message', 'Email sent');

    //     // delete all users
    //     await prisma.user.deleteMany();
    // });
});
