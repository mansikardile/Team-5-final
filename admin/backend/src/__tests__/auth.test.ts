import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

describe('Admin Authentication API', () => {
  it('GET /api/health returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('POST /api/auth/login with invalid credentials returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'invalid@katalyst.org',
        password: 'WrongPassword123!',
      });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('POST /api/auth/login with valid seeded admin credentials returns JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@katalyst.org',
        password: 'KatalystAdmin@2025',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.admin.email).toBe('admin@katalyst.org');
  });
});
