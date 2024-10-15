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

exports.validateTicket = [
    body('event_id').not().isEmpty().withMessage('Event ID is required'),
    body('user_id').not().isEmpty().withMessage('User ID is required'),
    body('ticket_number').not().isEmpty().withMessage('Ticket number is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('date').isISO8601().withMessage('Date must be a valid ISO 8601 date'),
    body('status').not().isEmpty().withMessage('Status is required')
];

exports.validateTicketUpdate = [
    body('event_id').optional().not().isEmpty().withMessage('Event ID is required'),
    body('user_id').optional().not().isEmpty().withMessage('User ID is required'),
    body('ticket_number').optional().not().isEmpty().withMessage('Ticket number is required'),
    body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('date').optional().isISO8601().withMessage('Date must be a valid ISO 8601 date'),
    body('status').optional().not().isEmpty().withMessage('Status is required')
];

exports.validateEvent = [
    body('name').not().isEmpty().withMessage('Event name is required'),
    body('location').not().isEmpty().withMessage('Location is required'),
    body('date').isISO8601().withMessage('Date must be a valid ISO 8601 date'),
    body('time')
        .matches(/^(0?[1-9]|1[0-2]):[0-5]\d (AM|PM)$/i)
        .withMessage('Time must be in the format hh:mm AM/PM (12-hour format)'),
    body('venue').not().isEmpty().withMessage('Venue is required')
];

exports.validateEventUpdate = [
    body('name').not().isEmpty().withMessage('Event name is required'),
    body('location').not().isEmpty().withMessage('Location is required'),
    body('date').isISO8601().withMessage('Date must be a valid ISO 8601 date'),
    body('time')
        .matches(/^(0?[1-9]|1[0-2]):[0-5]\d (AM|PM)$/i)
        .withMessage('Time must be in the format hh:mm AM/PM (12-hour format)'),
    body('venue').not().isEmpty().withMessage('Venue is required')
];

exports.validationResult = (req, res, next) => {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
