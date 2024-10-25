const request = require('supertest');
const app = require('../server');
const { MongoClient, ObjectId } = require('mongodb');

let connection;
let db;

beforeAll(async () => {
    try {
        connection = await MongoClient.connect(process.env.MONGO_URI);
        db = connection.db('finalproject');
        app.locals.db = db;

        await db.collection('venues').insertMany([
            { _id: new ObjectId('507f1f77bcf86cd799439010'), name: 'Venue 1', city: 'City 1' },
            { _id: new ObjectId('507f1f77bcf86cd799439011'), name: 'Venue 2', city: 'City 2' }
        ]);
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
});

afterAll(async () => {
    if (db) {
        await db.collection('venues').deleteMany({
            _id: {
                $in: [
                    new ObjectId('507f1f77bcf86cd799439010'),
                    new ObjectId('507f1f77bcf86cd799439011')
                ]
            }
        });
    }
    if (connection) {
        await connection.close();
    }
});

describe('Venue API Routes', () => {
    // Test GET /venues
    test('GET /venues should return a list of venues', async () => {
        const res = await request(app).get('/venues');
        expect(res.statusCode).toBe(200);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    // Test GET /venues/:id
    test('GET /venues/:id should return a single venue by ID', async () => {
        const venueId = '507f1f77bcf86cd799439010';
        const res = await request(app).get(`/venues/${venueId}`);
        expect(res.statusCode).toBe(200);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.body).toHaveProperty('_id', venueId);
    });

    // Test GET /venues/:id for invalid ID format
    test('GET /venues/:id should return 400 for invalid venue ID format', async () => {
        const invalidId = 'invalid-id';
        const res = await request(app).get(`/venues/${invalidId}`);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Invalid venue ID format');
    });

    // Test GET /venues/:id for non-existing venue
    test('GET /venues/:id should return 404 if venue is not found', async () => {
        const nonExistentId = '507f1f77bcf86cd799439999';
        const res = await request(app).get(`/venues/${nonExistentId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Venue not found');
    });   
});
