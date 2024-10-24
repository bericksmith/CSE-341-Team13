const request = require('supertest');
const app = require('../server');

// Mock the MongoDB client connection
jest.mock('mongodb', () => {
    const actualMongo = jest.requireActual('mongodb');
    return {
        ...actualMongo,
        MongoClient: {
            connect: jest.fn(() => Promise.resolve({
                db: jest.fn().mockReturnValue({
                    collection: jest.fn().mockReturnValue({
                        find: jest.fn().mockReturnThis(),
                        toArray: jest.fn().mockResolvedValue([]),
                        findOne: jest.fn().mockResolvedValue(null),
                    })
                })
            }))
        }
    };
});

describe('Server Tests', () => {
    test('GET / should respond with the homepage HTML', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('<h1>Event Planning API</h1>');
    });

    test('GET /api-docs should serve the API documentation', async () => {
        const res = await request(app).get('/api-docs/');
        expect(res.statusCode).toBe(200);
    });

    test('GET /users should respond with a list of users', async () => {
        const res = await request(app).get('/users');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /invalid-route should return 404 for unknown routes', async () => {
        const res = await request(app).get('/invalid-route');
        expect(res.statusCode).toBe(404);
    });
});
