const express = require('express');
const eventController = require('../controllers/eventController');
const { validateEvent, validateEventUpdate, validationResult } = require('../middleware/validation');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/authentication');

router.get('/', eventController.getEvents);

router.get('/:id', eventController.getEventById);

router.post('/', ensureAuthenticated, validateEvent, validationResult, eventController.createEvent);

router.put('/:id', ensureAuthenticated, validateEventUpdate, validationResult, eventController.updateEvent);

router.delete('/:id', ensureAuthenticated, eventController.deleteEvent);

module.exports = router;
