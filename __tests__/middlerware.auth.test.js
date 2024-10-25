const { ensureAuthenticated } = require('../middleware/authentication');

describe('ensureAuthenticated Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            isAuthenticated: jest.fn()
        };
        res = {
            status: jest.fn(() => res),
            send: jest.fn()
        };
        next = jest.fn();
    });

    test('should call next if the user is authenticated', () => {
        req.isAuthenticated.mockReturnValue(true);

        ensureAuthenticated(req, res, next);

        expect(req.isAuthenticated).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    test('should return 401 if the user is not authenticated', () => {
        req.isAuthenticated.mockReturnValue(false);

        ensureAuthenticated(req, res, next);

        expect(req.isAuthenticated).toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.send).toHaveBeenCalledWith('Unauthorized');
    });
});
