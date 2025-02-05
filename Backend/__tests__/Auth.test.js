const request = require('supertest');
const express = require('express');
const User = require('../src/models/User');
const authRoutes = require('../src/routes/authRoutes');

jest.mock('../src/models/User');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    const validUser = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@test.com',
      password: 'password123'
    };

    test('should register user successfully', async () => {
      User.create.mockResolvedValue(validUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User successfully created');
      expect(response.body.user).toEqual(validUser);
    });

    test('should return 400 for password less than 6 characters', async () => {
      const invalidUser = { ...validUser, password: '12345' };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Password less than 6 characters');
    });

    test('should return 400 when user creation fails', async () => {
      User.create.mockRejectedValue(new Error('Duplicate email'));

      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User not successful created');
    });
  });

  describe('POST /api/auth/login', () => {
    const validCredentials = {
      email: 'john@test.com',
      password: 'password123'
    };

    test('should login successfully', async () => {
      const user = { ...validCredentials, id: 1 };
      User.findOne.mockResolvedValue(user);

      const response = await request(app)
        .post('/api/auth/login')
        .send(validCredentials);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.user).toEqual(user);
    });

    test('should return 400 for missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'john@test.com' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username or Password not present');
    });

    test('should return 401 for invalid credentials', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send(validCredentials);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Login not successful');
    });

    test('should return 400 when login throws error', async () => {
      User.findOne.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/auth/login')
        .send(validCredentials);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('An error occurred');
    });
  });
});