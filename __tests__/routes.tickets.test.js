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

        await db.collection('tickets').insertMany([
            { _id: new ObjectId('507f1f77bcf86cd799439020'), event_id: '12345', user_id: '507f1f77bcf86cd799439011', ticket_number: 'A001', price: 100, status: 'valid' },
            { _id: new ObjectId('507f1f77bcf86cd799439021'), event_id: '54321', user_id: '507f1f77bcf86cd799439012', ticket_number: 'B002', price: 200, status: 'valid' }
        ]);
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
});

afterAll(async () => {
    if (db) {
        await db.collection('tickets').deleteMany({
            _id: {
                $in: [
                    new ObjectId('507f1f77bcf86cd799439020'),
                    new ObjectId('507f1f77bcf86cd799439021')
                ]
            }
        });
    }
    if (connection) {
        await connection.close();
    }
});

describe('Ticket API GET Endpoints', () => {
    test('GET /tickets should return a list of tickets', async () => {
        const res = await request(app).get('/tickets');
        expect(res.statusCode).toBe(200); 
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('GET /tickets/:id should return a single ticket by ID', async () => {
        const ticketId = '507f1f77bcf86cd799439020';
        const res = await request(app).get(`/tickets/${ticketId}`);
        expect(res.statusCode).toBe(200);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.body).toHaveProperty('_id', ticketId);
    });

    test('GET /tickets/:id should return 400 for invalid ticket ID format', async () => {
        const invalidId = 'invalid-id';
        const res = await request(app).get(`/tickets/${invalidId}`);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Invalid ticket ID format');
    });

    test('GET /tickets/:id should return 404 for a non-existing ticket', async () => {
        const nonExistentId = '507f1f77bcf86cd799439099';
        const res = await request(app).get(`/tickets/${nonExistentId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Ticket not found');
    });
});
