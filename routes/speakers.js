const express = require('express');
const router = express.Router();
const speakerController = require('../controllers/speakerController');
const { validateSpeaker, validateSpeakerUpdate, validationResult } = require('../middleware/validation');
const { ensureAuthenticated } = require('../middleware/authentication');

router.get('/', speakerController.getSpeakers);

router.get('/:id', speakerController.getSingleSpeaker);

router.post('/', ensureAuthenticated, validateSpeaker, validationResult, speakerController.createSpeaker);

router.put('/:id', ensureAuthenticated, validateSpeakerUpdate, validationResult, speakerController.updateSpeaker);

router.delete('/:id', ensureAuthenticated, speakerController.deleteSpeaker);

module.exports = router;
