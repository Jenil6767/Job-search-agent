import request from 'supertest';
import { createApp } from '../src/app.js';

describe('Health Check API', () => {
  const app = createApp();

  it('GET /api/v1/health should return health check response structure', async () => {
    const response = await request(app).get('/api/v1/health');
    
    // Status can be 200 (if services live) or 503 (if services not yet running in CI/offline)
    expect([200, 503]).toContain(response.status);
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('services');
    expect(response.body.data.services).toHaveProperty('mongodb');
    expect(response.body.data.services).toHaveProperty('redis');
  });

  it('GET /api/v1/unknown-route should return 404 with standard envelope', async () => {
    const response = await request(app).get('/api/v1/unknown-route');
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('NotFoundError');
  });
});
