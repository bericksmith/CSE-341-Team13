const request = require('supertest');
const app = require('../server');

jest.mock('mongodb', () => {
    const actualMongo = jest.requireActual('mongodb');
    return {
        MongoClient: {
            connect: jest.fn().mockResolvedValue({
                db: jest.fn().mockReturnValue({
                    collection: jest.fn().mockReturnThis(),
                    find: jest.fn().mockReturnThis(),
                    findOne: jest.fn(),
                    toArray: jest.fn(),
                }),
            }),
        },
        ObjectId: actualMongo.ObjectId,
    };
});

describe('User API GET Endpoints', () => {
    test('GET /users should return a list of users', async () => {
        const mockUsers = [
            { _id: '1', fname: 'John', lname: 'Doe', email: 'john.doe@example.com' },
            { _id: '2', fname: 'Jane', lname: 'Smith', email: 'jane.smith@example.com' }
        ];
        
        const db = app.locals.db;
        db.collection().find().toArray.mockResolvedValue(mockUsers);

        const res = await request(app).get('/users');
        expect(res.statusCode).toBe(200);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('GET /users/:id should return a single user by ID', async () => {
        const mockUser = { _id: '507f1f77bcf86cd799439011', fname: 'John', lname: 'Doe', email: 'john.doe@example.com' };

        const db = app.locals.db;
        db.collection().findOne.mockResolvedValue(mockUser);

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
        const nonExistentId = '507f1f77bcf86cd799439012';

        const db = app.locals.db;
        db.collection().findOne.mockResolvedValue(null);

        const res = await request(app).get(`/users/${nonExistentId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'User not found');
    });
});
