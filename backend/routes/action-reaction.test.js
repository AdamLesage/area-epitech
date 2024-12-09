const request = require('supertest');
const express = require('express');
const actionRouter = require('./action');
const { PrismaClient } = require('@prisma/client');
const userRouter = require('./user');
const reactionRouter = require('./reaction');

require('dotenv').config();

// Setup Prisma Client
const prisma = new PrismaClient();
let app;

beforeAll(async () => {
    // Setup the express app and routes
    app = express();
    app.use(express.json());
    app.use('/api/', userRouter)
    app.use('/api/', actionRouter); // Use the action router
    app.use('/api/', reactionRouter);
});

// Clean up the database after tests
afterAll(async () => {
    await prisma.$disconnect();
});

afterAll(async () => {
    // Clean up the database after the tests
    await prisma.user.deleteMany();
    await prisma.$disconnect();
});

let userToken; // Variable to hold user token for authentication
let actionId; // Variable to hold action ID for testing
let actionUuid;
describe('Action Routes', () => {

    beforeAll(async () => {
        const response = await request(app).post('/api/user').send({
            name: "Jhon",
            surname: "Doe",
            bio: 'I am a user',
            birthDate: new Date().toISOString(),
            email: "joh.jhn@mail.com",
            phoneNumber: '123456789',
            password: 'password1234',
        });
        userToken = response.body.authToken;
    });

    it('should create a new action', async () => {
        const actionData = {
            title: "Sample Action Title",
            typeAction: "dropbox_on_new_file",
            typeReaction: "dropbox_shares_file",
            reactionData: {
                notification: "Action was successful",
                timestamp: "2023-10-01T12:00:00Z"
            },
            actionData: {
                details: "User  clicked the button"
            }
        };

        const response = await request(app)
            .post('/api/action')
            .set('Authorization', userToken)
            .send(actionData);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('uuid');
        actionId = response.body.id;
        actionUuid = response.body.uuid;
    }, 10000);

    it('should return a list of all actions', async () => {
        const response = await request(app)
            .get('/api/action')
            .set('Authorization', userToken);

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    }, 10000);

    
    it('should return 404 for unknown action', async () => {
        const response = await request(app)
        .delete('/api/action/999999')
        .set('Authorization', userToken);
        
        expect(response.statusCode).toBe(404);
        expect(response.text).toBe("action not find");
    }, 10000);
    
    it('should update the action status', async () => {
        const response = await request(app)
        .put(`/api/action/set_active/${actionUuid}`)
        .set('Authorization', userToken)
        .send({ isActive: false });
        
        expect(response.statusCode).toBe(200);
        expect(response.body.updatedActionReaction).toHaveProperty('isActive', false);
    }, 10000);

    it('should create a new reaction', async () => {
        const uuid = actionUuid;
        const actionData = {
            userId: 'user-123',
            reaction: 'like'
        };
        const response = await request(app)
            .post(`/api/reaction/${uuid}`)
            .send(actionData);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'receive reaction');
        expect(response.body).toHaveProperty('action');
        expect(response.body.action).toHaveProperty('uuid', uuid);
    }, 10000);

    it('should return 500 for unknown action-reaction', async () => {
        const uuid = 'fervtrbvtrgeezfergeggrf';
        const reactionData = {
            userId: 'user-123',
            reaction: 'like'
        };

        const response = await request(app)
            .post(`/api/reaction/${uuid}`)
            .send(reactionData);

        expect(response.statusCode).toBe(404);
        expect(response.text).toBe("unknow action-Reaction");
    }, 10000);

    it('should delete the action', async () => {
        const response = await request(app)
            .delete(`/api/action/${actionId}`)
            .set('Authorization', userToken);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'action deleted');
    }, 10000);
});