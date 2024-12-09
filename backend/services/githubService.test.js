const request = require('supertest');
const express = require('express');
const router = require('./githubService');
const axios = require('axios');

jest.mock('axios');

const app = express();
app.use(express.json());
app.use('/api/github', router);

describe('POST /api/github/create-issue', () => {
    it('should create an issue and return 200', async () => {
        axios.post.mockResolvedValue({ data: {} });

        const response = await request(app)
            .post('/api/github/create-issue')
            .send({
                title: 'Test Issue',
                body: 'This is a test issue'
            })
            .set('Authorization', `Bearer test_token`);

        expect(response.status).toBe(200);
        expect(response.text).toBe("{\"message\":\"Issue created successfully\"}");
    });

    it('should return 500 if there is an error', async () => {
        axios.post.mockRejectedValue(new Error('Error creating issue'));

        const response = await request(app)
            .post('/api/github/create-issue')
            .send({
                title: 'Test Issue',
                body: 'This is a test issue'
            })
            .set('Authorization', `Bearer test_token`);

        expect(response.status).toBe(500);
        expect(response.text).toContain('Internal server error');
    });
});