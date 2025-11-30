import request from 'supertest';
import app from '../src/app';

describe('E2E Tests', () => {
  it('should return a 200 response for the root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});