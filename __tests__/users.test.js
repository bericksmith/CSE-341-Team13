const request = require('supertest');
const app = require('../server');

// Mock the MongoDB client connection
jest.mock('mongodb', () => {
    const actualMongo = jest.requireActual('mongodb');
    const { ObjectId } = actualMongo;
    return {
        ...actualMongo,
        MongoClient: {
            connect: jest.fn(() => Promise.resolve({
                db: jest.fn().mockReturnValue({
                    collection: jest.fn().mockReturnValue({
                        find: jest.fn().mockReturnThis(),
                        toArray: jest.fn().mockResolvedValue([
                            { _id: new ObjectId('507f1f77bcf86cd799439011'), fname: 'John', lname: 'Doe', email: 'john.doe@example.com' },
                            { _id: new ObjectId('507f1f77bcf86cd799439012'), fname: 'Jane', lname: 'Smith', email: 'jane.smith@example.com' }
                        ]),
                        findOne: jest.fn().mockImplementation((query) => {
                            if (query._id.equals(new ObjectId('507f1f77bcf86cd799439011'))) {
                                return { _id: new ObjectId('507f1f77bcf86cd799439011'), fname: 'John', lname: 'Doe', email: 'john.doe@example.com' };
                            }
                            return null;
                        })
                    })
                })
            }))
        }
    };
});

describe('User API GET Endpoints', () => {
    test('GET /users should return a list of users', async () => {
        const res = await request(app).get('/users');
        expect(res.statusCode).toBe(200);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /users/:id should return a single user by ID', async () => {
        const userId = '507f1f77bcf86cd799439011';
        const res = await request(app).get(`/users/${userId}`);
        expect(res.statusCode).toBe(200);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.body).toHaveProperty('_id', userId);
    });

    test('GET /users/:id should return 400 for invalid user ID format', async () => {
        const invalidId = 'invalid-id';
        const res = await request(app).get(`/users/${invalidId}`);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Invalid user ID format');
    });

    test('GET /users/:id should return 404 for a non-existing user', async () => {
        const nonExistentId = '507f1f77bcf86cd799439999';
        const res = await request(app).get(`/users/${nonExistentId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'User not found');
    });
});
