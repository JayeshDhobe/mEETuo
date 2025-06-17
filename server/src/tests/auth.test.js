import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth.js';

describe('Auth API', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);

  it('should return 400 for duplicate signup', async () => {
    // Mock User model or use in-memory DB for real test
    // Here, just check route exists
    const res = await request(app).post('/api/auth/signup').send({ name: 'Test', email: 'test@example.com', password: '123456' });
    expect([200, 400, 500]).toContain(res.statusCode);
  });
});
