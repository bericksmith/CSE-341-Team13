const request = require('supertest');
const { MongoClient } = require('mongodb');
let app;

jest.mock('mongodb', () => {
  const actualMongoDB = jest.requireActual('mongodb');
  return {
    ...actualMongoDB,
    MongoClient: {
      connect: jest.fn().mockResolvedValue({
        db: jest.fn(() => ({
          collection: jest.fn().mockReturnValue({
            find: jest.fn().mockReturnValue({
              toArray: jest.fn().mockResolvedValue([{ fname: 'John', lname: 'Doe' }]),
            }),
          }),
        })),
        close: jest.fn(),
      }),
    },
  };
});

jest.spyOn(MongoClient, 'connect');

beforeAll(() => {
  app = require('../server');
});

describe('Server initialization', () => {
  it('should serve the home route (GET /)', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Welcome to the Group 13 Final Project Events API Hub');
  });

  it('should serve the users route (GET /users)', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ fname: 'John', lname: 'Doe' }]);
  });
});
