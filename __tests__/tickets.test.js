beforeAll(() => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });
  
  afterAll(() => {
    console.error.mockRestore();
  });

const { getTickets, getTicketById } = require('../controllers/ticketsController');
const { ObjectId } = require('mongodb');

const mockRequest = () => ({
  app: {
    locals: {
      db: {
        collection: jest.fn().mockReturnThis(),
        findOne: jest.fn(),
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn(),
      },
    },
  },
  params: {},
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Ticket Controller - GET Endpoints - Team 13', () => {

  describe('getTickets', () => {
    it('return a list of tickets with status 200', async () => {
      const mockTickets = [
        { _id: '1', ticket_number: '123456789', price: 50, status: 'active' },
        { _id: '2', ticket_number: '987654321', price: 60, status: 'active' }
      ];

      const req = mockRequest();
      const res = mockResponse();

      req.app.locals.db.collection().find().toArray.mockResolvedValue(mockTickets);

      await getTickets(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTickets);
    });

    it('return 500 if an error occurs', async () => {
      const req = mockRequest();
      const res = mockResponse();

      req.app.locals.db.collection().find().toArray.mockRejectedValue(new Error('Database error'));

      await getTickets(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'An error occurred while fetching tickets',
        error: expect.any(Error)
      });
    });
  });

  describe('getTicketById', () => {
    it('return a ticket by ID with status 200', async () => {
      const mockTicket = { _id: new ObjectId('507f1f77bcf86cd799439011'), ticket_number: '123456789', price: 50, status: 'active' };

      const req = mockRequest();
      const res = mockResponse();
      req.params.id = '507f1f77bcf86cd799439011';

      req.app.locals.db.collection().findOne.mockResolvedValue(mockTicket);

      await getTicketById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTicket);
    });

    it('return 400 for invalid ObjectId format', async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.id = 'invalid-id';

      await getTicketById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid ticket ID format' });
    });

    it('return 404 if ticket is not found', async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.id = '507f1f77bcf86cd799439011';

      req.app.locals.db.collection().findOne.mockResolvedValue(null);

      await getTicketById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Ticket not found' });
    });

    it('return 500 if an error occurs', async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.id = '507f1f77bcf86cd799439011';

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
