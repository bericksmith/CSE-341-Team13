const express = require('express');
const speakerController = require('../controllers/speakerController');
const { validateSpeaker, validateSpeakerUpdate, validationResult } = require('../middleware/validation');
const router = express.Router();

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Unauthorized');
};

router.get('/', speakerController.getSpeakers);

router.get('/:id', speakerController.getSingleSpeaker);

router.post('/', ensureAuthenticated, validateSpeaker, validationResult, speakerController.createSpeaker);

router.put('/:id', ensureAuthenticated, validateSpeakerUpdate, validationResult, speakerController.updateSpeaker);

router.delete('/:id', ensureAuthenticated, speakerController.deleteSpeaker);

module.exports = router;
