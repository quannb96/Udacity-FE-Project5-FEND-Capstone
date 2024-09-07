const request = require('supertest');
const app = require('../server/server');

describe('Test server endpoints', () => {
  it('should return status code 200 for /test endpoint', async () => {
    const response = await request(app).get('/test');
    expect(response.status).toBe(200);
  });
});
