const { getUsers, getUserById } = require('../controllers/userController');
const { ObjectId } = require('mongodb');

const mockRequest = () => ({
    app: {
        locals: {
            db: {
                collection: jest.fn().mockReturnThis(),
                find: jest.fn().mockReturnThis(),
                toArray: jest.fn(),
                findOne: jest.fn(),
            },
        },
    },
    params: {}
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('User Controller', () => {

    test('getAllUsers should return a list of users', async () => {
        const mockUsers = [
            { _id: new ObjectId('507f1f77bcf86cd799439011'), fname: 'John', lname: 'Doe', email: 'john.doe@example.com' },
            { _id: new ObjectId('507f1f77bcf86cd799439012'), fname: 'Jane', lname: 'Smith', email: 'jane.smith@example.com' }
        ];

        const req = mockRequest();
        const res = mockResponse();

        req.app.locals.db.collection().find().toArray.mockResolvedValue(mockUsers);

        await getUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    test('getUserById should return a single user by ID', async () => {
        const mockUser = { _id: new ObjectId('507f1f77bcf86cd799439011'), fname: 'John', lname: 'Doe', email: 'john.doe@example.com' };

        const req = mockRequest();
        const res = mockResponse();
        req.params.id = '507f1f77bcf86cd799439011';

        req.app.locals.db.collection().findOne.mockResolvedValue(mockUser);

        await getUserById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    test('getUserById should return 400 for invalid user ID format', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = 'invalid-id';

        await getUserById(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid user ID format' });
    });

    test('getUserById should return 404 if user is not found', async () => {
        const req = mockRequest();
        const res = mockResponse();
        req.params.id = '507f1f77bcf86cd799439999';

        req.app.locals.db.collection().findOne.mockResolvedValue(null);

        await getUserById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
});
