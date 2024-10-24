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
                            { _id: new ObjectId('123451234512345123451234'), name: 'Fun Event', location: 'Where', date: '2024-10-29', time: '08:00 PM', venue: 'Facility Name' },
                            { _id: new ObjectId('123451234512345123451235'), name: 'Speaker Event', location: 'There', date: '2024-11-29', time: '08:00 AM', venue: 'Central Park' }
                        ]),
                        findOne: jest.fn().mockImplementation((query) => {
                            if (query._id.equals(new ObjectId('123451234512345123451234'))) {
                                return { _id: new ObjectId('123451234512345123451234'), name: 'Fun Event', location: 'Where', date: '2024-10-29', time: '08:00 PM', venue: 'Facility Name' };
                            }
                            return null;
                        }),
                        insertOne: jest.fn().mockResolvedValue({
                            acknowledged: true,
                            insertedID: new ObjectId('123451234512345123459999')
                        }),
                        deleteOne: jest.fn().mockResolvedValue({
                            acknowledged: true,
                            deletedCount: 1
                        }),
                        updateOne: jest.fn().mockResolvedValue({
                            acknowledged: true,
                            matchedCount: 1,
                            modifiedCount: 1
                        })
                    })
                })
            }))
        }
    };
});

describe('Event API GET Endpoints', () => {
    test('GET /events should return a list of events', async () => {
        const res = await request(app).get('/events');
        expect(res.statusCode).toBe(200);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(Array.isArray(res.body)).toBe(true);
    });
    test('Get /events:id should return a single event by ID', async () => {
        const eventId = '123451234512345123451234';
        const res = await request(app).get(`/events/${eventId}`);
        expect(res.statusCode).toBe(200);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.body).toHaveProperty('_id', eventId);
    });
    test('GET /events:id should return 400 for invalid event ID format', async () => {
        const eventId = '12345';
        const res = await request(app).get(`/events/${eventId}`);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Invalid event ID format');
    });
    test('GET /events:id should return 404 for an event ID not found', async () => {
        const eventId = '123451234512345123456789';
        const res = await request(app).get(`/events/${eventId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Event not found');
    });
});

// describe('Event API POST Endpoints', () => {
//     test('POST /events should add an event', async () => {
//         const res = await request(app).post('/events').send({
//             name: "New Years Celebration",
//             location: "College Station",
//             date: "2024-12-31",
//             time: "10:00 PM",
//             venue: "Clock Tower",
//         });
//         expect(res.statusCode).toBe(201);
//         expect(res.header['content-type']).toBe('application/json; charset=utf-8');
//     });
// });

// describe('Event API UPDATE Endpoints', () => {
//     test('PUT /events:id should update an event', async () => {
//         const eventId = '123451234512345123451234';
//         const res = await request(app).put(`/events/${eventId}`).send({
//             name: 'Climbing Day Challenge',
//             location: 'Austin',
//             date: '2024-11-15',
//             time: '10:00 AM',
//             venue: 'Austin Bouldering Project'
//         });
//         expect(res.statusCode).toBe(200);
//         expect(res.body).toMatchObject({ message: 'Event updated successfully' });
//     });
// });

// describe('Event API DELETE Endpoints', () => {
//     test('DELETE /events:id should delete and event by ID', async () => {
//         const eventId = '123451234512345123459999';
//         const res = await request(app).delete(`/events/${eventId}`);
//         expect(res.statusCode).toBe(200);
//         expect(res.body).toMatchObject({ message: 'Event deleted successfully'});
//     });
// });