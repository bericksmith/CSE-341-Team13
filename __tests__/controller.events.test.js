beforeAll(() => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
});

afterAll(() => {
    console.error.mockRestore();
});

const { getEvents, getEventById } = require('../controllers/eventController');
const { ObjectId } = require('mongodb');

const mockRequest = (params = {}, body = {}, user = {}) => ({
    params,
    body,
    user,
    app: { 
        locals: { 
            db: { 
                collection: jest.fn().mockReturnThis(),
                find: jest.fn().mockReturnThis(),
                toArray: jest.fn(),
                findOne: jest.fn(),
            },
        },
    }
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    res.setHeader = jest.fn().mockReturnValue(res);
    return res;
};

const mockEvents = [
    { _id: new ObjectId('123451234512345123451234'), name: 'Fun Event', location: 'Where', date: '2024-10-29', time: '08:00 PM', venue: 'Facility Name' },
    { _id: new ObjectId('123451234512345123451235'), name: 'Speaker Event', location: 'There', date: '2024-11-29', time: '08:00 AM', venue: 'Central Park' }
];

describe('Events Controller GET Endpoints', () => {
    describe('getEvents', () => {
        test('should return a list of all events', async () => {
           
            const req = mockRequest({}, {}, { id: 'mockUserId'});
            const res = mockResponse();

            req.app.locals.db.collection.mockReturnValue({
                find: jest.fn().mockReturnValue({
                    toArray: jest.fn().mockResolvedValue(mockEvents)
                })
            });

            await getEvents(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockEvents);
        });

        test('should return 500 if an error occurs', async () => {
            const req = mockRequest({}, {}, { id: 'mockUserId' });
            const res = mockResponse();

            req.app.locals.db.collection.mockReturnValue({
                find: jest.fn().mockReturnValue({
                    toArray: jest.fn().mockRejectedValue(new Error('Error fetching events:'))
                })
            });

            await getEvents(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'An error occurred while fetching events',
                error: expect.any(Error)
            });
        });
    });

    describe('getEventById', () => {
        test('should return a single event by ID', async () => {
            const req = mockRequest({ id: '123451234512345123451235' }, {}, { id: 'mockUserId' });
            const res = mockResponse();

            req.app.locals.db.collection().findOne.mockResolvedValue(mockEvents[1]);

            await getEventById(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockEvents[1]);
        });

        test('should return 400 with invalid event ID', async () => {
            const req = mockRequest({ id: 'invalid_id' }, {}, { id: 'invalid_id' });
            const res = mockResponse();

            await getEventById(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ 
                message: 'Invalid event ID format'
            });
        });

        test('should return 404 if event not found', async () => {
            const req = mockRequest({ id: '123451234512345123454444' }, {}, { id: 'mockUserId' });
            const res = mockResponse();

            req.app.locals.db.collection().findOne.mockResolvedValue(null);
            
            await getEventById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Event not found'
            });
        });

        test('should return 500 if an error occurs', async () => {
            const req = mockRequest({ id: '123451234512345123454444' }, {}, { id: 'mockUserId' });
            const res = mockResponse();

            req.app.locals.db.collection().findOne.mockRejectedValue(new Error('Error fetching event by ID:'));

            await getEventById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'An error occurred while fetching the event',
                error: expect.any(Error)
            });
        });
    });
});


