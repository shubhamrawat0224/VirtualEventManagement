const request = require('supertest');
const {app} = require('../../index');
const users = require('../../data/users');

describe('Auth API', () => {
  beforeEach(() => users.length = 0); // reset user store before each test

  test('should register a new user', async () => {
    const res = await request(app).post('/api/register').send({
      name: 'Test User',
      email: 'shubhamrawat@0224@gmail.com',

      password: 'password123',
      role: 'attendee',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully.');
  });

  test('should login an existing user', async () => {
    await request(app).post('/api/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'attendee',
    });
    const res = await request(app).post('/api/login').send({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});