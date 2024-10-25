const request = require('supertest');
const express = require('express');
const speakerRoutes = require('../routes/speakers');
const { ObjectId } = require('mongodb');

const app = express();
app.use(express.json());
app.use('/speakers', speakerRoutes);

// // mock authentication
jest.mock('../middleware/authentication', () => ({
    ensureAuthenticated: (req, res, next) => next()
}));


const existingSpeaker = {
    '_id': '670f3c5670ad0b497b591f9b',
    'name': 'Ana Maria Lopez',
    'bio': 'Ana Maria is a renowned nutritionist with over 10 years of experience promoting healthy lifestyles.',
    'photo_url': 'https://example.com/ana_lopez.jpg',
    'email': 'ana.lopez@example.com',
    'event': '670de14cd436d85952af4c3f',
    'specialization': 'Sports Nutrition',
    'availability': true,
    'location': 'Austin, TX'
};

// Mock the DB connection
app.locals.db = {
    collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnValue({
            toArray: jest.fn().mockResolvedValue([existingSpeaker])
        }),
        findOne: jest.fn().mockResolvedValue(existingSpeaker),
        insertOne: jest.fn().mockResolvedValue({ acknowledged: true, insertedId: '670f3c5670ad0b497b591f9b' }),
        updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
        deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 })
    })
};

// Test GET all speakers
describe('GET /speakers', () => {
    it('should return all speakers', async () => {
        const res = await request(app).get('/speakers');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([existingSpeaker]);
    });
});

// Test GET a single speaker
describe('GET /speakers/:id', () => {
    it('should return a single speaker', async () => {
        const res = await request(app).get('/speakers/670f3c5670ad0b497b591f9b');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual(existingSpeaker);
    });

    it('should return 400 for invalid ObjectId', async () => {
        const res = await request(app).get('/speakers/invalid_id');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({ error: 'Invalid ID format' });
    });
});

// Test POST a new speaker
describe('POST /speakers', () => {
    it('should create a new speaker', async () => {
        const newSpeaker = {
            name: 'Marcela Santana',
            bio: 'Expert in nutrition',
            photo_url: 'https://example.com/marcela.jpg',
            email: 'marcela@example.com',
            event: '670de14cd436d85952af4c3f',
            specialization: 'Sports Nutrition',
            availability: true,
            location: 'Austin, TX'
        };


        const res = await request(app)
            .post('/speakers')
            .send(newSpeaker);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toEqual({ _id: '670f3c5670ad0b497b591f9b' });
    });
});



// Test PUT a new speaker
describe('PUT /speakers/:id', () => {
    it('should update a speaker and return 204 if successful', async () => {

        const mockUpdateOne = jest.fn().mockResolvedValue({ modifiedCount: 1 });
        app.locals.db.collection.mockReturnValue({ updateOne: mockUpdateOne });


        const updatedSpeaker = {
            name: 'Updated Name',
            bio: 'Updated Bio'
        };


        const res = await request(app)
            .put('/speakers/670f3c5670ad0b497b591f9b')
            .send(updatedSpeaker);


        expect(res.statusCode).toEqual(204);
        expect(mockUpdateOne).toHaveBeenCalledWith(
            { _id: new ObjectId('670f3c5670ad0b497b591f9b') },
            { $set: updatedSpeaker }
        );
    });

    it('should return 400 for invalid ObjectId', async () => {
        const res = await request(app)
            .put('/speakers/invalid_id')
            .send({ name: 'Updated Name' });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({ error: 'Invalid ID format' });
    });

    it('should return 404 if speaker is not found', async () => {
        const mockUpdateOne = jest.fn().mockResolvedValue({ modifiedCount: 0 });
        app.locals.db.collection.mockReturnValue({ updateOne: mockUpdateOne });

        const res = await request(app)
            .put('/speakers/670f3c5670ad0b497b591f9b')
            .send({ name: 'Updated Name' });

        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({ error: 'speaker not found or no changes made' });
    });
});



// Test DELETE a speaker
describe('DELETE /speakers/:id', () => {
    it('should delete a speaker and return 204 if successful', async () => {    

      
        const mockDeleteOne = jest.fn().mockResolvedValue({ deletedCount: 1 });
        app.locals.db.collection.mockReturnValue({ deleteOne: mockDeleteOne });

    
        const res = await request(app)
            .delete('/speakers/670f3c5670ad0b497b591f9b');

     
        expect(res.statusCode).toEqual(204);
        expect(mockDeleteOne).toHaveBeenCalledWith({ _id: new ObjectId('670f3c5670ad0b497b591f9b') });
    });

    it('should return 400 for invalid ObjectId', async () => {
        const res = await request(app)
            .delete('/speakers/invalid_id');

        expect(res.statusCode).toEqual(400);
        expect(res.body).toEqual({ error: 'Invalid ID format' });
    });

    it('should return 500 if speaker deletion fails', async () => {
        const mockDeleteOne = jest.fn().mockResolvedValue({ deletedCount: 0 });
        app.locals.db.collection.mockReturnValue({ deleteOne: mockDeleteOne });

        const res = await request(app)
            .delete('/speakers/670f3c5670ad0b497b591f9b');

        expect(res.statusCode).toEqual(500);
        expect(res.body).toEqual({ error: 'Failed deleting speaker' });
    });
});
