require('dotenv').config();

const request = require('supertest');
const { MongoClient, ObjectId } = require('mongodb');
const app = require('../server');

let connection;
let db;

beforeAll(async () => {
    try {      
        connection = await MongoClient.connect(process.env.MONGO_URI);

        db = connection.db('finalproject');
        app.locals.db = db;

        await db.collection('users').insertMany([
            { _id: new ObjectId('507f1f77bcf86cd799439011'), fname: 'John', lname: 'Doe', email: 'john.doe@example.com' },
            { _id: new ObjectId('507f1f77bcf86cd799439012'), fname: 'Jane', lname: 'Smith', email: 'jane.smith@example.com' }
        ]);
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
});

afterAll(async () => {
    if (db) {
        await db.collection('users').deleteMany({});
    }
    if (connection) {
        await connection.close();
    }
});

describe('User API GET Endpoints', () => {
    test('GET /users should return a list of users', async () => {
        const res = await request(app).get('/users');
        expect(res.statusCode).toBe(200);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
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
