const request = require('supertest');
const express = require('express');
const userRouter = require('./user');

const app = express();
app.use(express.json());
userRouter.setup(app);

describe('User Routes', () => {
    it('should respond to GET /user/id', async () => {
        const response = await request(app).get('/user/1');
        expect(response.statusCode).toBe(200);
    });

    it('/user/:id should return a user', async () => {
        const response = await request(app).get('/user/1');
        expect(response.body).toEqual({ id: 1 });
    });
});