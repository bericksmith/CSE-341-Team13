const express = require('express');
const venueController = require('../controllers/venueController');
const router = express.Router();
const { validateVenue, validateVenueUpdate, validationResult } = require('../middleware/validation');
const { ensureAuthenticated } = require('../middleware/authentication');


router.get('/', venueController.getVenues);

router.get('/:id', venueController.getVenueById);

router.post('/', ensureAuthenticated, validateVenue, validationResult, venueController.createVenue);

router.put('/:id', ensureAuthenticated,validateVenueUpdate, validationResult, venueController.updateVenue);

router.delete('/:id', ensureAuthenticated, venueController.deleteVenue);

module.exports = router;
