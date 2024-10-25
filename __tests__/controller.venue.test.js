const { getVenues, getVenueById, createVenue, updateVenue, deleteVenue } = require('../controllers/venueController');
const { ObjectId } = require('mongodb');

// Mock request and response objects
const mockRequest = () => ({
    app: {
        locals: {
            db: {
                collection: jest.fn().mockReturnThis(),
                find: jest.fn().mockReturnThis(),
                toArray: jest.fn(),
                findOne: jest.fn(),
                insertOne: jest.fn(),
                updateOne: jest.fn(),
                deleteOne: jest.fn(),
            },
        },
    },
    params: {},
    body: {},
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Venue Controller - CRUD Operations', () => {

    // Test for getVenues
    test('getVenues should return a list of venues', async () => {
        const mockVenues = [
            { _id: new ObjectId('507f1f77bcf86cd799439010'), name: 'Venue 1', city: 'City 1' },
            { _id: new ObjectId('507f1f77bcf86cd799439011'), name: 'Venue 2', city: 'City 2' }
        ];

        const req = mockRequest();
        const res = mockResponse();

        req.app.locals.db.collection().find().toArray.mockResolvedValue(mockVenues);

        await getVenues(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockVenues);
    });

    // Test for getVenueById
    test('getVenueById should return a venue by ID', async () => {
        const mockVenue = { _id: new ObjectId('507f1f77bcf86cd799439010'), name: 'Venue 1', city: 'City 1' };

        const req = mockRequest();
        const res = mockResponse();
        req.params.id = '507f1f77bcf86cd799439010';

        req.app.locals.db.collection().findOne.mockResolvedValue(mockVenue);

        await getVenueById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockVenue);
    });

    // Test for getVenueById with invalid ID
    test('getVenueById should return 400 for invalid venue ID format', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = 'invalid-id';

        await getVenueById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid venue ID format' });
    });

    // Test for getVenueById when venue not found
    test('getVenueById should return 404 if venue is not found', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = '507f1f77bcf86cd799439012';

        req.app.locals.db.collection().findOne.mockResolvedValue(null);

        await getVenueById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Venue not found' });
    });
});
