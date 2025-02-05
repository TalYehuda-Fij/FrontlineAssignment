const request = require('supertest');
const express = require('express');
const { sendEmail, fetchEmails } = require('../src/services/emailService');

jest.mock('../src/services/emailService');

const app = express();
app.use(express.json());
app.use('/api/email', require('../src/routes/emailRoutes'));

describe('Email Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/email/send', () => {
    const validEmail = {
      from: 'sender@test.com',
      to: 'receiver@test.com',
      subject: 'Test Subject',
      body: 'Test Body',
      date: '2024-02-05'
    };

    test('should send email successfully', async () => {
      sendEmail.mockResolvedValue({ success: true });

      const response = await request(app)
        .post('/api/email/send')
        .send(validEmail);

      expect(response.status).toBe(200);
      expect(sendEmail).toHaveBeenCalled();
    });

    test('should return 400 for missing required fields', async () => {
      const invalidEmail = { ...validEmail };
      delete invalidEmail.subject;

      const response = await request(app)
        .post('/api/email/send')
        .send(invalidEmail);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('All fields are required');
    });

    test('should return 500 when email service fails', async () => {
      sendEmail.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/email/send')
        .send(validEmail);

      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/email/fetch-emails', () => {
    test('should fetch emails successfully', async () => {
      const mockEmails = [
        { id: 1, subject: 'Test Email 1' },
        { id: 2, subject: 'Test Email 2' }
      ];
      
      fetchEmails.mockResolvedValue(mockEmails);

      const response = await request(app)
        .post('/api/email/fetch-emails');

      expect(response.status).toBe(200);
      expect(fetchEmails).toHaveBeenCalled();
    });
  });
});