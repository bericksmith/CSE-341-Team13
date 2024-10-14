const express = require('express');
const ticketController = require('../controllers/ticketsController');
const { validateTicket, validateTicketUpdate, validationResult } = require('../middleware/validation');
const router = express.Router();

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Unauthorized');
};

router.get('/', ticketController.getTickets);

router.get('/:id', ticketController.getTicketById);

router.post('/', ensureAuthenticated, validateTicket, validationResult, ticketController.createTicket);

router.put('/:id', ensureAuthenticated, validateTicketUpdate, validationResult, ticketController.updateTicket);

router.delete('/:id', ensureAuthenticated, ticketController.deleteTicket);

module.exports = router;