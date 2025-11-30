import request from 'supertest';
import { app } from '../src/app';

describe('Auth Endpoints', () => {
    it('should return a 200 status for the login endpoint', async () => {
        const response = await request(app).post('/api/auth/login').send({
            username: 'testuser',
            password: 'testpassword'
        });
        expect(response.status).toBe(200);
    });
});