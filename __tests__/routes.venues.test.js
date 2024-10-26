require('dotenv').config();

const request = require('supertest');
const { MongoClient, ObjectId } = require('mongodb');
const app = require('../server');

let connection;
let db;

// Conectar ao MongoDB e preparar os dados de teste
beforeAll(async () => {
    try {
        connection = await MongoClient.connect(process.env.MONGO_URI);
        db = connection.db('finalproject');
        app.locals.db = db;

        // Inserir venues de teste
        await db.collection('venues').insertMany([
            { _id: new ObjectId('652beae45c7ec7c00a9ed11f'), name: 'Venue 1', address: '123 Main St 1', city:'Los Angeles', state:'CA', postal: '90002', capacity:'500', created_at: '2024-10-25T19:13:07.004Z'},
            { _id: new ObjectId('652beae45c7ec7c00a9ed120'), name: 'Venue 2', address: '123 Main St 2', city:'Salt Lake', state:'UT', postal:'90001', capacity:'550', created_at: '2024-10-25T19:13:07.004Z'}
        ]);
        server = app.listen(4000);
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
});

// Limpar os dados de teste após os testes
afterAll(async () => {
    if (db) {
        await db.collection('venues').deleteMany({
            _id: { 
                $in: [
                    new ObjectId('652beae45c7ec7c00a9ed11f'), 
                    new ObjectId('652beae45c7ec7c00a9ed120')
                ]
            }
        });
    }
    if (connection) {
        await connection.close();
    }
    if (server) {
        server.close(); // Fechar o servidor após os testes
    }
});

describe('Venue API Endpoints', () => {
    test('GET /venues should return a list of venues', async () => {
        const res = await request(app).get('/venues');
        expect(res.statusCode).toBe(200);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('GET /venues/:id should return a single venue by ID', async () => {
        const venueId = '652beae45c7ec7c00a9ed11f';
        const res = await request(app).get(`/venues/${venueId}`);
        expect(res.statusCode).toBe(200);
        expect(res.header['content-type']).toBe('application/json; charset=utf-8');
        expect(res.body).toHaveProperty('_id', venueId);
    });

    test('GET /venues/:id should return 400 for invalid venue ID format', async () => {
        const invalidId = 'invalid-id';
        const res = await request(app).get(`/venues/${invalidId}`);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Invalid venue ID format');
    });

    test('GET /venues/:id should return 404 for a non-existing venue', async () => {
        const nonExistentId = '652beae45c7ec7c00a9ed111';
        const res = await request(app).get(`/venues/${nonExistentId}`);
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('message', 'Venue not found');
    });
});
