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
        expect(response.body.message).toBe('Issue created successfully');
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
        expect(response.body.message).toBe('Internal server error');
    });
});

describe('POST /api/github/create-repo', () => {
    it('should create a repository and return 200', async () => {
        axios.post.mockResolvedValue({ data: { html_url: 'http://github.com/test/repo' } });

        const response = await request(app)
            .post('/api/github/create-repo')
            .send({
                name: 'Test Repo',
                description: 'This is a test repository'
            })
            .set('Authorization', `Bearer test_token`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Repository created successfully');
        expect(response.body.repo_url).toBe('http://github.com/test/repo');
    });

    it('should return 400 if name or description is missing', async () => {
        const response = await request(app)
            .post('/api/github/create-repo')
            .send({
                name: 'Test Repo'
            })
            .set('Authorization', `Bearer test_token`);

        expect(response.status).toBe(400);
        expect(response.text).toBe('Name and description are required');
    });

    it('should return 500 if GitHub token is not defined', async () => {
        delete process.env.GITHUB_TOKEN;

        const response = await request(app)
            .post('/api/github/create-repo')
            .send({
                name: 'Test Repo',
                description: 'This is a test repository'
            });

        expect(response.status).toBe(500);
        expect(response.text).toBe('GitHub access token is not defined');
    });
});
