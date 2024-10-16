const express = require('express');
const ticketController = require('../controllers/ticketsController');
const { validateTicket, validateTicketUpdate, validationResult } = require('../middleware/validation');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authentication');

router.get('/', ticketController.getTickets);

router.get('/:id', ticketController.getTicketById);

router.post('/', ensureAuthenticated, validateTicket, validationResult, ticketController.createTicket);

router.put('/:id', ensureAuthenticated, validateTicketUpdate, validationResult, ticketController.updateTicket);

router.delete('/:id', ensureAuthenticated, ticketController.deleteTicket);

module.exports = router;
