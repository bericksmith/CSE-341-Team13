const { validateUser, validateTicket, validateEvent, validationResult } = require('../middleware/validation');
const { body } = require('express-validator');

const mockRequest = () => {
    return {
        body: {},
        isAuthenticated: jest.fn(() => false),
    };
};

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};

const runValidators = async (req, res, middlewares) => {
    for (const middleware of middlewares) {
        await middleware(req, res, () => {});
    }
};

describe('Validation Middleware Tests', () => {
    let req, res;

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
    });

    describe('validateUser', () => {
        it('should pass with valid data', async () => {
            req.body = {
                email: 'test@example.com',
                password: 'password123',
                fname: 'John',
                lname: 'Doe',
                role: 'admin',
                status: 'active',
                dob: '1990-01-01',
                location: 'USA'
            };

            await runValidators(req, res, validateUser);
            validationResult(req, res, () => {});

            expect(res.status).not.toHaveBeenCalled();
        });

        it('should fail if fields are missing or invalid', async () => {
            req.body = {
                email: 'invalid-email',
                password: '123',
                fname: '',
                lname: '',
                dob: 'not-a-date',
            };

            await runValidators(req, res, validateUser);
            validationResult(req, res, () => {});

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                errors: expect.arrayContaining([
                    expect.objectContaining({ msg: 'Must be a valid email address' }),
                    expect.objectContaining({ msg: 'Password must be at least 5 characters long' }),
                    expect.objectContaining({ msg: 'First name is required' }),
                    expect.objectContaining({ msg: 'Last name is required' }),
                    expect.objectContaining({ msg: 'Role is required' }),
                    expect.objectContaining({ msg: 'Status is required' }),
                    expect.objectContaining({ msg: 'Date of birth must be a valid date' })
                ])
            }));
        });
    });

    describe('validateTicket', () => {
        it('should pass with valid data', async () => {
            req.body = {
                event_id: '507f1f77bcf86cd799439011',
                user_id: '507f1f77bcf86cd799439012',
                ticket_number: 'TICKET123',
                price: 50.0,
                date: '2024-10-01',
                status: 'active'
            };

            await runValidators(req, res, validateTicket);
            validationResult(req, res, () => {});

            expect(res.status).not.toHaveBeenCalled();
        });

        it('should fail if fields are missing or invalid', async () => {
            req.body = {
                event_id: '',
                price: 'invalid-price',
                date: 'not-a-date',
            };

            await runValidators(req, res, validateTicket);
            validationResult(req, res, () => {});

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                errors: expect.arrayContaining([
                    expect.objectContaining({ msg: 'Event ID is required' }),
                    expect.objectContaining({ msg: 'Price must be a positive number' }),
                    expect.objectContaining({ msg: 'Date must be a valid ISO 8601 date' })
                ])
            }));
        });
    });

    describe('validateEvent', () => {
        it('should pass with valid event data', async () => {
            req.body = {
                name: 'Event Name',
                location: 'Location A',
                date: '2024-12-01',
                time: '09:00 AM',
                venue: 'Venue A'
            };

            await runValidators(req, res, validateEvent);
            validationResult(req, res, () => {});

            expect(res.status).not.toHaveBeenCalled();
        });

        it('should fail if event fields are missing or invalid', async () => {
            req.body = {
                name: '',
                time: 'invalid-time',
                date: 'invalid-date'
            };

            await runValidators(req, res, validateEvent);
            validationResult(req, res, () => {});

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                errors: expect.arrayContaining([
                    expect.objectContaining({ msg: 'Event name is required' }),
                    expect.objectContaining({ msg: 'Time must be in the format hh:mm AM/PM (12-hour format)' }),
                    expect.objectContaining({ msg: 'Date must be a valid ISO 8601 date' })
                ])
            }));
        });
    });
});
