const express = require('express');
const venueController = require('../controllers/venueController');
const router = express.Router();


router.get('/', venueController.getVenues);

router.get('/:id', venueController.getVenueById);

router.post('/', venueController.createVenue);

router.put('/:id', venueController.updateVenue);

router.delete('/:id', venueController.deleteVenue);

module.exports = router;
