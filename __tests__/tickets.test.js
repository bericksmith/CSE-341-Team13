beforeAll(() => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });
  
  afterAll(() => {
    console.error.mockRestore();
  });

const { getTickets, getTicketById } = require('../controllers/ticketsController');
const { ObjectId } = require('mongodb');

// Mocking request and response objects
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

describe('Tickets Controller - GET Endpoints', () => {
    describe('getTickets', () => {
        it('should return a list of tickets with status 200', async () => {
            const mockTickets = [
                { _id: '507f1f77bcf86cd799439020', event_id: '12345', user_id: '507f1f77bcf86cd799439011', ticket_number: 'A001', price: 100, status: 'valid' },
                { _id: '507f1f77bcf86cd799439021', event_id: '54321', user_id: '507f1f77bcf86cd799439012', ticket_number: 'B002', price: 200, status: 'valid' }
            ];

            const req = mockRequest();
            const res = mockResponse();

            req.app.locals.db.collection().find().toArray.mockResolvedValue(mockTickets);

            await getTickets(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockTickets);
        });

        it('should return 500 if an error occurs', async () => {
            const req = mockRequest();
            const res = mockResponse();

            req.app.locals.db.collection().find().toArray.mockRejectedValue(new Error('Database error'));

            await getTickets(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'An error occurred while fetching tickets',
                error: expect.any(Error),
            });
        });
    });

    describe('getTicketById', () => {
        it('should return a ticket by ID with status 200', async () => {
            const mockTicket = { _id: new ObjectId('507f1f77bcf86cd799439020'), event_id: '12345', user_id: '507f1f77bcf86cd799439011', ticket_number: 'A001', price: 100, status: 'valid' };

            const req = mockRequest();
            const res = mockResponse();
            req.params.id = '507f1f77bcf86cd799439020';

            req.app.locals.db.collection().findOne.mockResolvedValue(mockTicket);

            await getTicketById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockTicket);
        });

        it('should return 400 for invalid ticket ID format', async () => {
            const req = mockRequest();
            const res = mockResponse();
            req.params.id = 'invalid-id';

            await getTicketById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Invalid ticket ID format' });
        });

        it('should return 404 if ticket is not found', async () => {
            const req = mockRequest();
            const res = mockResponse();
            req.params.id = '507f1f77bcf86cd799439020';

            req.app.locals.db.collection().findOne.mockResolvedValue(null);

            await getTicketById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Ticket not found' });
        });

        it('should return 500 if an error occurs', async () => {
            const req = mockRequest();
            const res = mockResponse();
            req.params.id = '507f1f77bcf86cd799439020';

            req.app.locals.db.collection().findOne.mockRejectedValue(new Error('Database error'));

            await getTicketById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'An error occurred while fetching the ticket',
                error: expect.any(Error),
            });
        });
    });
});
