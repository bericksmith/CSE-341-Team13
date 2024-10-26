const { getVenues, getVenueById, createVenue, updateVenue, deleteVenue } = require('../controllers/venueController');
const { ObjectId } = require('mongodb');

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
    body: {}
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Venue Controller', () => {

    test('getVenues should return a list of venues', async () => {
        const mockVenues = [
            { _id: new ObjectId('652beae45c7ec7c00a9ed11f'), name: 'Venue 1', address: '123 Main St', city: 'Los Angeles', state: 'CA', postal: '90001', capacity: 500 },
            { _id: new ObjectId('652beae45c7ec7c00a9ed120'), name: 'Venue 2', address: '456 Elm St', city: 'New York', state: 'NY', postal: '10001', capacity: 600 }
        ];

        const req = mockRequest();
        const res = mockResponse();

        req.app.locals.db.collection().find().toArray.mockResolvedValue(mockVenues);

        await getVenues(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockVenues);
    });

    test('getVenueById should return a single venue by ID', async () => {
        const mockVenue = { _id: new ObjectId('652beae45c7ec7c00a9ed11f'), name: 'Venue 1', address: '123 Main St', city: 'Los Angeles', state: 'CA', postal: '90001', capacity: 500 };

        const req = mockRequest();
        const res = mockResponse();
        req.params.id = '652beae45c7ec7c00a9ed11f';

        req.app.locals.db.collection().findOne.mockResolvedValue(mockVenue);

        await getVenueById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockVenue);
    });

    test('getVenueById should return 400 for invalid venue ID format', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = 'invalid-id';

        await getVenueById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid venue ID format' });
    });

    test('getVenueById should return 404 if venue is not found', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = '652beae45c7ec7c00a9ed999';

        req.app.locals.db.collection().findOne.mockResolvedValue(null);

        await getVenueById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Venue not found' });
    });

    test('createVenue should create a new venue', async () => {
        const newVenue = {
            name: 'Sunshine Theater',
            address: '789 Oak St',
            city: 'San Francisco',
            state: 'CA',
            postal: '94103',
            capacity: 400
        };

        const req = mockRequest();
        const res = mockResponse();
        req.body = newVenue;

        req.app.locals.db.collection().insertOne.mockResolvedValue({ insertedId: new ObjectId('652beae45c7ec7c00a9ed121') });

        await createVenue(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining(newVenue));
    });

    test('updateVenue should update an existing venue', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = '652beae45c7ec7c00a9ed11f';
        req.body = { name: 'Updated Venue' };

        req.app.locals.db.collection().updateOne.mockResolvedValue({ matchedCount: 1 });

        await updateVenue(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Venue updated successfully' });
    });

    test('updateVenue should return 404 if venue is not found', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = '652beae45c7ec7c00a9ed999';
        req.body = { name: 'Updated Venue' };

        req.app.locals.db.collection().updateOne.mockResolvedValue({ matchedCount: 0 });

        await updateVenue(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Venue not found' });
    });

    test('deleteVenue should delete a venue', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = '652beae45c7ec7c00a9ed11f';

        req.app.locals.db.collection().deleteOne.mockResolvedValue({ deletedCount: 1 });

        await deleteVenue(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Venue deleted successfully' });
    });

    test('deleteVenue should return 404 if venue is not found', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = '652beae45c7ec7c00a9ed999';

        req.app.locals.db.collection().deleteOne.mockResolvedValue({ deletedCount: 0 });

        await deleteVenue(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Venue not found' });
    });
});
