beforeAll(() => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {});
  });
  
  afterAll(() => {
    console.error.mockRestore();
  });
  

const { getUsers, getUserById } = require('../controllers/userController');
const { ObjectId } = require('mongodb');

const mockRequest = () => ({
  app: {
    locals: {
      db: {
        collection: jest.fn().mockReturnThis(),
        findOne: jest.fn(),
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn(),
      },
    },
  },
  params: {},
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('User Controller - GET Endpoints - Team 13', () => {

  describe('getUsers', () => {
    it('return a list of users with status 200', async () => {
      const mockUsers = [
        { _id: '1', fname: 'John', lname: 'Doe', email: 'john.doe@example.com' },
        { _id: '2', fname: 'Jane', lname: 'Smith', email: 'jane.smith@example.com' }
      ];

      const req = mockRequest();
      const res = mockResponse();

      req.app.locals.db.collection().find().toArray.mockResolvedValue(mockUsers);

      await getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('return 500 if an error occurs', async () => {
      const req = mockRequest();
      const res = mockResponse();

      req.app.locals.db.collection().find().toArray.mockRejectedValue(new Error('Database error'));

      await getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'An error occurred while fetching users',
        error: expect.any(Error)
      });
    });
  });

  describe('getUserById', () => {
    it('return a user by ID with status 200', async () => {
      const mockUser = { _id: new ObjectId('507f1f77bcf86cd799439011'), fname: 'John', lname: 'Doe', email: 'john.doe@example.com' };

      const req = mockRequest();
      const res = mockResponse();
      req.params.id = '507f1f77bcf86cd799439011';

      req.app.locals.db.collection().findOne.mockResolvedValue(mockUser);

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('return 400 for invalid ObjectId format', async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.id = 'invalid-id';

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid user ID format' });
    });

    it('return 404 if user is not found', async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.id = '507f1f77bcf86cd799439011';

      req.app.locals.db.collection().findOne.mockResolvedValue(null);

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('return 500 if an error occurs', async () => {
      const req = mockRequest();
      const res = mockResponse();
      req.params.id = '507f1f77bcf86cd799439011';

      req.app.locals.db.collection().findOne.mockRejectedValue(new Error('Database error'));

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'An error occurred while fetching the user',
        error: expect.any(Error),
      });
    });
  });
});
