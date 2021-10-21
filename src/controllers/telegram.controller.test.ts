import request from 'supertest';
import { app } from '../app';

describe('Test TelegramController', () => {
  it('Request /telegram/mechmarket should return true', async () => {
    const result = await request(app).get('/telegram/mechmarket').send();

    expect(result.status).toBe(200);
    expect(result.body.data).toBe(true);
  });
});