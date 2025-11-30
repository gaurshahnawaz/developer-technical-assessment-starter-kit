const request = require('supertest');
const app = require('../src/app');

describe('Projects Endpoints', () => {
    it('should fetch all projects', async () => {
        const res = await request(app).get('/api/projects');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('projects');
    });
});