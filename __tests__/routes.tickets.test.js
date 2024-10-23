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
                            { _id: new ObjectId('507f1f77bcf86cd799439020'), event_id: '12345', user_id: '507f1f77bcf86cd799439011', ticket_number: 'A001', price: 100, status: 'valid' },
                            { _id: new ObjectId('507f1f77bcf86cd799439021'), event_id: '54321', user_id: '507f1f77bcf86cd799439012', ticket_number: 'B002', price: 200, status: 'valid' }
                        ]),
                        findOne: jest.fn().mockImplementation((query) => {
                            if (query._id.equals(new ObjectId('507f1f77bcf86cd799439020'))) {
                                return { _id: new ObjectId('507f1f77bcf86cd799439020'), event_id: '12345', user_id: '507f1f77bcf86cd799439011', ticket_number: 'A001', price: 100, status: 'valid' };
                            }
                            return null;
                        })
                    })
                })
            }))
        }
    };
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
