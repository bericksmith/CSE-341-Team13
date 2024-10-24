beforeAll(() => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });
  
  afterAll(() => {
    console.error.mockRestore();
  });

const { getEvents, getEventById } = require('../controllers/eventController');
const { ObjectId } = require('mongodb');

const mockRequest = () => ({
    app: {
        locals: {
            db: {
                collection: jest.fn().mockReturnThis(),
                find: jest.fn().mockReturnThis(),
                toArray: jest.fn(),
                findOne: jest.fn(),
            },
        },
    },
    params: {}
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Events Controller GET Endpoints', () => {
    describe('getEvents', () => {
        it('should return a list of all events', async () => {
            const mockEvents = [
                { _id: new ObjectId('123451234512345123451234'), name: 'Fun Event', location: 'Where', date: '2024-10-29', time: '08:00 PM', venue: 'Facility Name' },
                { _id: new ObjectId('123451234512345123451235'), name: 'Speaker Event', location: 'There', date: '2024-11-29', time: '08:00 AM', venue: 'Central Park' }
            ];

            const req = mockRequest();
            const res = mockResponse();

            req.app.locals.db.collection().find().toArray.mockResolvedValue(mockEvents);

            await getEvents(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockEvents);
        });
    });

    describe('getEventById', () => {
        it('should return a single event by ID', async () => {
            const mockEvent = {_id: new ObjectId('123451234512345123451235'), name: 'Speaker Event', location: 'There', date: '2024-11-29', time: '08:00 AM', venue: 'Central Park' };

            const req = mockRequest();
            const res = mockResponse();
            req.params.id = '123451234512345123451235';

            req.app.locals.db.collection().findOne.mockResolvedValue(mockEvent);
            await getEventById(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockEvent);
        });
    });

});
