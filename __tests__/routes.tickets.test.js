const request = require('supertest');
const express = require('express');
const ticketRouter = require('../routes/tickets');
const ticketController = require('../controllers/ticketsController');

const app = express();
app.use(express.json());
app.use('/tickets', ticketRouter);

jest.mock('../controllers/ticketsController');

describe('Ticket Routes - GET Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getTickets controller on GET /tickets', async () => {
    ticketController.getTickets.mockImplementation((req, res) => {
      res.status(200).json({ tickets: [{ event: 'Concert', price: 50 }] });
    });

    const res = await request(app).get('/tickets');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('tickets');
    expect(ticketController.getTickets).toHaveBeenCalledTimes(1);
  });

  it('should call getTicketById controller on GET /tickets/:id', async () => {
    ticketController.getTicketById.mockImplementation((req, res) => {
      res.status(200).json({ ticket: { event: 'Concert', price: 50 } });
    });

    const res = await request(app).get('/tickets/1');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('ticket');
    expect(ticketController.getTicketById).toHaveBeenCalledTimes(1);

    const req = ticketController.getTicketById.mock.calls[0][0];
    expect(req.params).toEqual({ id: '1' });
  });
});
