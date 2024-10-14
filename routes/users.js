const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser, validateUserUpdate, validationResult } = require('../middleware/validation');

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('Unauthorized');
};

router.get('/', userController.getUsers);

router.get('/:id', userController.getUserById);

router.post('/', ensureAuthenticated, validateUser, validationResult, userController.createUser);

router.put('/:id', ensureAuthenticated, validateUserUpdate, validationResult, userController.updateUser);

router.delete('/:id', ensureAuthenticated, userController.deleteUser);

module.exports = router;
