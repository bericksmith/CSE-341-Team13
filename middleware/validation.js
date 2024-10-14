const { body } = require('express-validator');

exports.validateUser = [
    body('email').isEmail().withMessage('Must be a valid email address'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    body('fname').not().isEmpty().withMessage('First name is required'),
    body('lname').not().isEmpty().withMessage('Last name is required'),
    body('role').not().isEmpty().withMessage('Role is required'),
    body('status').not().isEmpty().withMessage('Status is required'),
    body('dob').isISO8601().withMessage('Date of birth must be a valid date'),
    body('location').not().isEmpty().withMessage('Location is required')
];

exports.validateUserUpdate = [
    body('email').optional().isEmail().withMessage('Must be a valid email address'),
    body('password').optional().isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    body('fname').optional().not().isEmpty().withMessage('First name is required'),
    body('lname').optional().not().isEmpty().withMessage('Last name is required'),
    body('role').optional().not().isEmpty().withMessage('Role is required'),
    body('status').optional().not().isEmpty().withMessage('Status is required'),
    body('dob').optional().isISO8601().withMessage('Date of birth must be a valid date'),
    body('location').optional().not().isEmpty().withMessage('Location is required')
];

exports.validationResult = (req, res, next) => {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
