const request = require('supertest');
const express = require('express');
const userRouter = require('./user');
const { PrismaClient } = require('@prisma/client');

require('dotenv').config();

// Setup Prisma Client
const prisma = new PrismaClient();
let app;
let userUuid;

beforeAll(async () => {
    // Setup the express app and routes
    app = express();
    app.use(express.json());
    app.use('/api/', userRouter);

    // Clean up the database before the tests
    await prisma.user.deleteMany();
});

afterAll(async () => {
    // Clean up the database after the tests
    await prisma.user.deleteMany();
    await prisma.$disconnect();
});

describe('User Routes', () => {
    it('should create a new user', async () => {
        const response = await request(app).post('/api/user').send({
            name: "Jhon",
            surname: "Doe",
            bio: 'I am a user',
            birthDate: new Date().toISOString(),
            email: "john.doe@mail.com",
            phoneNumber: '123456789',
            password: 'password123',
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('uuid');
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('name');
        userUuid = response.body.uuid;
    }, 10000);

    it('should retrieve all users (GET /api/users)', async () => {
        const response = await request(app).get('/api/users');
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    }, 10000);

    it('should retrieve a user by uuid (GET /api/user/:uuid)', async () => {
        const response = await request(app).get(`/api/user/${userUuid}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('uuid', userUuid);
        expect(response.body).toHaveProperty('email', 'john.doe@mail.com');
    }, 10000);

    it('should update a user (PUT /api/user/:uuid)', async () => {
        const updatedData = {
            email: 'updated@email.com',
            bio: 'I am an updated user',
        };

        const response = await request(app).put(`/api/user/${userUuid}`).send(updatedData);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('email', 'updated@email.com');
        expect(response.body).toHaveProperty('bio', 'I am an updated user');
    }, 10000);

    it('should delete a user (DELETE /api/user/:uuid)', async () => {
        const response = await request(app).delete(`/api/user/${userUuid}`);
        expect(response.statusCode).toBe(200);

        const checkDeleted = await request(app).get(`/api/user/${userUuid}`);
        expect(checkDeleted.statusCode).toBe(404);
    }, 10000);
});