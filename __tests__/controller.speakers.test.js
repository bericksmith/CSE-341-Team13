beforeAll(() => {
    jest.spyOn(global.console, 'error').mockImplementation(() => { });
});

afterAll(() => {
    console.error.mockRestore();
});


const speakerController = require('../controllers/speakerController');
const { ObjectId } = require('mongodb');

// Mock the `req` and `res` objects
const mockRequest = (params = {}, body = {}) => ({
    params,
    body,
    app: { locals: { db: { collection: jest.fn() } } }
});


const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.setHeader = jest.fn().mockReturnValue(res);
    return res;
};


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

// Test for getSpeakers controller
describe('Speaker Controller - getSpeakers', () => {
    it('should return all speakers', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const mockSpeakers = [existingSpeaker];

        
        req.app.locals.db.collection.mockReturnValue({
            find: jest.fn().mockReturnValue({
                toArray: jest.fn().mockResolvedValue(mockSpeakers)
            })
        });

        await speakerController.getSpeakers(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockSpeakers);
    });


    it('should return 500 if an error occurs', async () => {
        const req = mockRequest();
        const res = mockResponse();

        // req.app.locals.db.collection().find().toArray.mockRejectedValue(new Error('Database error'));
        req.app.locals.db.collection.mockReturnValue({
            find: jest.fn().mockReturnValue({
                toArray: jest.fn().mockRejectedValue(new Error('Database error'))
            })
        });

        await speakerController.getSpeakers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: 'An error occurred while fetching speakers',
            error: expect.any(Error),
        });
    });
});



// Test for getSingleSpeaker controller
describe('Speaker Controller - getSingleSpeaker', () => {
    it('should return a single speaker', async () => {
        const req = mockRequest({ id: '670f3c5670ad0b497b591f9b' });
        const res = mockResponse();
        const mockSpeaker = existingSpeaker;

        req.app.locals.db.collection.mockReturnValue({
            findOne: jest.fn().mockResolvedValue(mockSpeaker)
        });

        await speakerController.getSingleSpeaker(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockSpeaker);
    });

    it('should return 400 for invalid ObjectId', async () => {
        const req = mockRequest({ id: 'invalid_id' });
        const res = mockResponse();

        await speakerController.getSingleSpeaker(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid ID format' });
    });

    it('should return 404 if speaker not found', async () => {
        const req = mockRequest({ id: '670f3c5670ad0b497b591f9b' });
        const res = mockResponse();

        req.app.locals.db.collection.mockReturnValue({
            findOne: jest.fn().mockResolvedValue(null)
        });

        await speakerController.getSingleSpeaker(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Speaker not found' });
    });

    it('should return 500 if an error occurs', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = '670f3c5670ad0b497b591f9b';

        // req.app.locals.db.collection().findOne.mockRejectedValue(new Error('Database error'));
        req.app.locals.db.collection.mockReturnValue({
            find: jest.fn().mockReturnValue({
                toArray: jest.fn().mockRejectedValue(new Error('Database error'))
            })
        });


        await speakerController.getSingleSpeaker(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Server Error' });
    });
});


// Test createSpeaker controller
describe('createSpeaker Controller', () => {
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

    let req, res;

    beforeEach(() => {
        req = {
            body: newSpeaker,
            app: {
                locals: {
                    db: {
                        collection: jest.fn().mockReturnValue({
                            // insertOne: jest.fn()
                            insertOne: jest.fn().mockResolvedValue({ insertedId: '670f3c5670ad0b497b591f9b' })
                        })
                    }
                }
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    it('should create a speaker and return 201 with the new speaker ID', async () => {
        
        const insertedId = '670f3c5670ad0b497b591f9b';
        req.app.locals.db.collection().insertOne.mockResolvedValue({ insertedId });       
        
        await speakerController.createSpeaker(req, res);

        expect(req.app.locals.db.collection().insertOne).toHaveBeenCalledWith(newSpeaker);         
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ _id: insertedId });
    });


    it('should return 500 if speaker creation fails', async () => {

        req.app.locals.db.collection().insertOne.mockRejectedValue(new Error('Database error'));
       
        await speakerController.createSpeaker(req, res);
     
        expect(res.status).toHaveBeenCalledWith(500);
        
        expect(res.json).toHaveBeenCalledWith({ error: 'Database error' });
    });
});



// Test for updateSpeaker controller
describe('updateSpeaker Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: '670f3c5670ad0b497b591f9b' },
            body: { name: 'Updated Name', bio: 'Updated Bio' },
            app: {
                locals: {
                    db: {
                        collection: jest.fn().mockReturnValue({
                            updateOne: jest.fn()
                        })
                    }
                }
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    it('should update a speaker and return 204', async () => {
        req.app.locals.db.collection().updateOne.mockResolvedValue({ modifiedCount: 1 });

        await speakerController.updateSpeaker(req, res);

        expect(req.app.locals.db.collection().updateOne).toHaveBeenCalledWith(
            { _id: new ObjectId('670f3c5670ad0b497b591f9b') },
            { $set: { name: 'Updated Name', bio: 'Updated Bio' } }
        );
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it('should return 400 if invalid ObjectId', async () => {
        req.params.id = 'invalid_id';

        await speakerController.updateSpeaker(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid ID format' });
    });

    it('should return 404 if speaker not found or no changes made', async () => {
        req.app.locals.db.collection().updateOne.mockResolvedValue({ modifiedCount: 0 });

        await speakerController.updateSpeaker(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'speaker not found or no changes made' });
    });
});



// Test for deleteSpeaker controller
describe('deleteSpeaker Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { id: '670f3c5670ad0b497b591f9b' },
            app: {
                locals: {
                    db: {
                        collection: jest.fn().mockReturnValue({
                            deleteOne: jest.fn()
                        })
                    }
                }
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn(),
        };
    });

    it('should delete a speaker and return 204', async () => {
        req.app.locals.db.collection().deleteOne.mockResolvedValue({ deletedCount: 1 });

        await speakerController.deleteSpeaker(req, res);

        expect(req.app.locals.db.collection().deleteOne).toHaveBeenCalledWith(
            { _id: new ObjectId('670f3c5670ad0b497b591f9b') }
        );
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it('should return 400 if invalid ObjectId', async () => {
        req.params.id = 'invalid_id';

        await speakerController.deleteSpeaker(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid ID format' });
    });

    it('should return 500 if deletion fails', async () => {
        req.app.locals.db.collection().deleteOne.mockResolvedValue({ deletedCount: 0 });

        await speakerController.deleteSpeaker(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed deleting speaker' });
    });
});
