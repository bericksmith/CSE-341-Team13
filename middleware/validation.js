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
exports.validateVenue= [
    body('name').optional().not().isEmpty().withMessage('Venue name is required'),
    body('address').optional().not().isEmpty().withMessage('Venue address is required'),
    body('city').optional().not().isEmpty().withMessage('City is required'),
    body('state').optional().not().isEmpty().withMessage('State is required'),
    body('postal').optional().not().isEmpty().withMessage('Postal is required'),
    body('capacity').optional().not().isEmpty().withMessage('Postal is required')
]
exports.validateVenueUpdate = [
    body('name').optional().not().isEmpty().withMessage('Venue name is required'),
    body('address').optional().not().isEmpty().withMessage('Venue address is required'),
    body('city').optional().not().isEmpty().withMessage('City is required'),
    body('state').optional().not().isEmpty().withMessage('State is required'),
    body('postal').optional().not().isEmpty().withMessage('Postal is required'),
    body('capacity').optional().not().isEmpty().withMessage('Postal is required')
]


exports.validateSpeaker = [
    body('name').not().isEmpty().withMessage('Speaker name is required'),
    body('bio').not().isEmpty().withMessage('Speaker bio is required'),
    body('photo_url').isURL().withMessage('Photo URL must be a valid URL'),
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('event').not().isEmpty().withMessage('Event ID is required')
        .isString().withMessage('Event ID must be a string')
        .matches(/^[a-f\d]{24}$/i).withMessage('Event ID must be a valid MongoDB ObjectId'),
    body('specialization').not().isEmpty().withMessage('Specialization is required'),
    body('availability').isBoolean().withMessage('Availability must be a boolean value'),
    body('location').not().isEmpty().withMessage('Location is required')
];

exports.validateSpeakerUpdate = [
    body('name').optional().not().isEmpty().withMessage('Speaker name cannot be empty if provided'),
    body('bio').optional().not().isEmpty().withMessage('Speaker bio cannot be empty if provided'),
    body('photo_url').optional().isURL().withMessage('Photo URL must be a valid URL if provided'),
    body('email').optional().isEmail().withMessage('Email must be a valid email address if provided'),
    body('event').optional().isString().withMessage('Event ID must be a string if provided')
        .matches(/^[a-f\d]{24}$/i).withMessage('Event ID must be a valid MongoDB ObjectId'),
    body('specialization').optional().not().isEmpty().withMessage('Specialization cannot be empty if provided'),
    body('availability').optional().isBoolean().withMessage('Availability must be a boolean value if provided'),
    body('location').optional().not().isEmpty().withMessage('Location cannot be empty if provided')
];
  

exports.validationResult = (req, res, next) => {
    const errors = require('express-validator').validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
